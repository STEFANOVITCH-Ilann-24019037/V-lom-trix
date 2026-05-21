<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('wear:check')]
#[Description('Vérifie les pièces usées >90% et envoie des notifications push')]
class CheckWearAlertsCommand extends Command
{
    public function handle(NotificationService $notifications): void
    {
        $this->info('Vérification des usures...');

        $users = User::with('bikes.parts')->get();

        foreach ($users as $user) {
            foreach ($user->bikes as $bike) {
                foreach ($bike->parts as $part) {
                    if ($part->wear_percentage >= 90) {
                        $this->line("  ⚠ {$user->email} — {$bike->name} — {$part->name} ({$part->wear_percentage}%)");
                        $notifications->sendWearAlert($user->id, $part->name, $bike->name);
                    }
                }
            }
        }

        $this->info('Vérification terminée.');
    }
}
