<?php

namespace App\Http\Controllers;

use App\Services\StravaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(private StravaService $strava) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $bikes = $user->bikes()->with('parts')->get();

        $lastActivities = [];
        if ($user->strava_connected) {
            $activities = $this->strava->fetchUserActivities($user->id, perPage: 5);
            $lastActivities = collect($activities)->map(fn($a) => [
                'id' => $a['id'],
                'name' => $a['name'],
                'distance_km' => round($a['distance'] / 1000, 1),
                'type' => $a['type'],
                'start_date' => $a['start_date'],
            ])->values()->all();
        }

        $totalKm = $bikes->sum('current_km');
        $nbActivities = $user->strava_connected ? count($this->strava->fetchUserActivities($user->id)) : 0;

        return response()->json([
            'bikes' => $bikes->map(fn($bike) => [
                'id' => $bike->id,
                'name' => $bike->name,
                'type' => $bike->type,
                'current_km' => $bike->current_km,
                'wear_percentage' => $bike->parts->isNotEmpty()
                    ? (int) round($bike->parts->avg('wear_percentage'))
                    : 0,
                'parts_count' => $bike->parts->count(),
                'critical_parts' => $bike->parts->filter(fn($p) => $p->wear_percentage >= 90)->count(),
            ]),
            'last_activities' => $lastActivities,
            'stats' => [
                'total_km' => $totalKm,
                'nb_activites' => $nbActivities,
                'nb_bikes' => $bikes->count(),
            ],
            'strava_connected' => $user->strava_connected,
        ]);
    }
}
