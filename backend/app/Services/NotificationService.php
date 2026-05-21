<?php

namespace App\Services;

use App\Models\MobileDevice;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    public function sendWearAlert(int $userId, string $partName, string $bikeName): void
    {
        $devices = MobileDevice::where('user_id', $userId)->get();

        if ($devices->isEmpty()) {
            return;
        }

        $fcmKey = config('services.fcm.server_key');
        if (!$fcmKey) {
            Log::warning('FCM_SERVER_KEY not configured — skipping push notification');
            return;
        }

        $tokens = $devices->pluck('device_token')->toArray();

        $payload = [
            'registration_ids' => $tokens,
            'notification' => [
                'title' => 'Maintenance requise — ' . $bikeName,
                'body' => "La pièce « {$partName} » a atteint 90% d'usure. Pensez à la remplacer !",
                'sound' => 'default',
            ],
            'data' => [
                'type' => 'wear_alert',
                'part_name' => $partName,
                'bike_name' => $bikeName,
            ],
        ];

        Http::withHeaders([
            'Authorization' => 'key=' . $fcmKey,
            'Content-Type' => 'application/json',
        ])->post('https://fcm.googleapis.com/fcm/send', $payload);
    }
}
