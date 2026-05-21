<?php

namespace App\Http\Controllers;

use App\Models\MobileDevice;
use App\Services\StravaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MobileController extends Controller
{
    public function __construct(private StravaService $strava) {}

    public function dashboard(Request $request): JsonResponse
    {
        $user = $request->user();
        $bikes = $user->bikes()->with('parts')->get();

        $lastActivity = null;
        if ($user->strava_connected) {
            $activities = $this->strava->fetchUserActivities($user->id, perPage: 1);
            if (!empty($activities)) {
                $a = $activities[0];
                $lastActivity = [
                    'name' => $a['name'],
                    'distance_km' => round($a['distance'] / 1000, 1),
                    'type' => $a['type'],
                    'start_date' => $a['start_date'],
                ];
            }
        }

        return response()->json([
            'bikes' => $bikes->map(fn($bike) => [
                'id' => $bike->id,
                'name' => $bike->name,
                'type' => $bike->type,
                'current_km' => $bike->current_km,
                'wear_percentage' => $bike->parts->isNotEmpty()
                    ? (int) round($bike->parts->avg('wear_percentage'))
                    : 0,
            ]),
            'last_activity' => $lastActivity,
            'stats' => [
                'total_km' => $bikes->sum('current_km'),
                'nb_bikes' => $bikes->count(),
            ],
        ]);
    }

    public function registerDevice(Request $request): JsonResponse
    {
        $data = $request->validate([
            'device_token' => 'required|string',
            'platform' => 'required|in:ios,android',
        ]);

        MobileDevice::updateOrCreate(
            ['device_token' => $data['device_token']],
            ['user_id' => $request->user()->id, 'platform' => $data['platform']]
        );

        return response()->json(['message' => 'Appareil enregistré.']);
    }

    public function simpleParts(Request $request, string $bikeId): JsonResponse
    {
        $bike = $request->user()->bikes()->findOrFail($bikeId);

        return response()->json($bike->parts->map(fn($p) => [
            'id' => $p->id,
            'name' => $p->name,
            'wear_percentage' => $p->wear_percentage,
        ]));
    }
}
