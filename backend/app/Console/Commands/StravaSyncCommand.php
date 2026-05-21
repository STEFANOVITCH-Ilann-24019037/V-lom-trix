<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\StravaService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('strava:sync')]
#[Description('Synchronise les activités Strava pour tous les utilisateurs connectés')]
class StravaSyncCommand extends Command
{
    public function handle(StravaService $strava): void
    {
        $users = User::where('strava_connected', true)->with('bikes.parts')->get();

        $this->info("Synchronisation pour {$users->count()} utilisateur(s)...");

        foreach ($users as $user) {
            $this->line("  → {$user->email}");

            $activities = $strava->fetchUserActivities($user->id);
            $rideActivities = collect($activities)->where('type', 'Ride');

            foreach ($user->bikes as $bike) {
                $bikeActivities = $rideActivities->filter(
                    fn($a) => isset($a['gear_id']) && $a['gear_id'] === ('b' . $bike->id)
                );

                $bikeKm = (int) round($bikeActivities->sum('distance') / 1000);

                if ($bikeKm > 0) {
                    $bike->increment('current_km', $bikeKm);
                    foreach ($bike->parts as $part) {
                        $part->increment('current_km', $bikeKm);
                    }
                }
            }
        }

        $this->info('Synchronisation terminée.');
    }
}
