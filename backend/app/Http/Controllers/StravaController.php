<?php

namespace App\Http\Controllers;

use App\Services\StravaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StravaController extends Controller
{
    public function __construct(private StravaService $strava) {}

    public function redirect(Request $request): JsonResponse
    {
        $url = $this->strava->getAuthorizationUrl();

        return response()->json(['url' => $url]);
    }

    public function callback(Request $request): JsonResponse
    {
        $code = $request->query('code');

        if (!$code) {
            return response()->json(['error' => 'Code d\'autorisation manquant.'], 400);
        }

        $tokenData = $this->strava->exchangeCodeForToken($code);

        if (isset($tokenData['errors'])) {
            return response()->json(['error' => 'Échec de l\'échange avec Strava.'], 400);
        }

        $this->strava->storeTokens($request->user(), $tokenData);

        return response()->json(['message' => 'Strava connecté avec succès.']);
    }

    public function sync(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->strava_connected) {
            return response()->json(['error' => 'Strava non connecté.'], 400);
        }

        $activities = $this->strava->fetchUserActivities($user->id);

        $totalKm = collect($activities)
            ->where('type', 'Ride')
            ->sum('distance') / 1000;

        foreach ($user->bikes as $bike) {
            $bikeActivities = collect($activities)
                ->where('type', 'Ride')
                ->filter(fn($a) => isset($a['gear_id']) && $a['gear_id'] === ('b' . $bike->id));

            $bikeKm = $bikeActivities->sum('distance') / 1000;

            if ($bikeKm > 0) {
                $bike->increment('current_km', (int) $bikeKm);

                foreach ($bike->parts as $part) {
                    $part->increment('current_km', (int) $bikeKm);
                }
            }
        }

        return response()->json([
            'message' => 'Synchronisation terminée.',
            'activities_count' => count($activities),
            'total_km' => round($totalKm, 1),
        ]);
    }
}
