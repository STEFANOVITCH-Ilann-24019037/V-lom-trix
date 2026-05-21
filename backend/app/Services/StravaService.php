<?php

namespace App\Services;

use App\Models\StravaToken;
use App\Models\User;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class StravaService
{
    private string $clientId;
    private string $clientSecret;
    private string $redirectUri;

    public function __construct()
    {
        $this->clientId = config('services.strava.client_id');
        $this->clientSecret = config('services.strava.client_secret');
        $this->redirectUri = config('services.strava.redirect_uri');
    }

    public function getAuthorizationUrl(): string
    {
        $params = http_build_query([
            'client_id' => $this->clientId,
            'redirect_uri' => $this->redirectUri,
            'response_type' => 'code',
            'approval_prompt' => 'auto',
            'scope' => 'read,activity:read_all',
        ]);

        return 'https://www.strava.com/oauth/authorize?' . $params;
    }

    public function exchangeCodeForToken(string $code): array
    {
        $response = Http::post('https://www.strava.com/oauth/token', [
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'code' => $code,
            'grant_type' => 'authorization_code',
        ]);

        return $response->json();
    }

    public function refreshToken(int $userId): ?StravaToken
    {
        $token = StravaToken::where('user_id', $userId)->first();
        if (!$token) return null;

        $response = Http::post('https://www.strava.com/oauth/token', [
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'refresh_token' => Crypt::decryptString($token->refresh_token),
            'grant_type' => 'refresh_token',
        ]);

        $data = $response->json();

        $token->update([
            'access_token' => Crypt::encryptString($data['access_token']),
            'refresh_token' => Crypt::encryptString($data['refresh_token']),
            'expires_at' => now()->addSeconds($data['expires_in']),
        ]);

        return $token->fresh();
    }

    public function fetchUserActivities(int $userId, int $page = 1, int $perPage = 30): array
    {
        $token = StravaToken::where('user_id', $userId)->first();
        if (!$token) return [];

        if ($token->isExpired()) {
            $token = $this->refreshToken($userId);
            if (!$token) return [];
        }

        $accessToken = Crypt::decryptString($token->access_token);

        $response = Http::withToken($accessToken)
            ->get('https://www.strava.com/api/v3/athlete/activities', [
                'page' => $page,
                'per_page' => $perPage,
            ]);

        if (!$response->successful()) {
            Log::error('Strava API error', ['status' => $response->status(), 'body' => $response->body()]);
            return [];
        }

        return $response->json();
    }

    public function storeTokens(User $user, array $tokenData): void
    {
        StravaToken::updateOrCreate(
            ['user_id' => $user->id],
            [
                'access_token' => Crypt::encryptString($tokenData['access_token']),
                'refresh_token' => Crypt::encryptString($tokenData['refresh_token']),
                'expires_at' => now()->addSeconds($tokenData['expires_in']),
            ]
        );

        $user->update(['strava_connected' => true]);
    }
}
