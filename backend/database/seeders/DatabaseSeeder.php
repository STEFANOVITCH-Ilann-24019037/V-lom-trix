<?php

namespace Database\Seeders;

use App\Models\Bike;
use App\Models\Part;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    private array $defaultParts = [
        ['name' => 'Chaîne',               'lifespan_km' => 3000],
        ['name' => 'Cassette',             'lifespan_km' => 6000],
        ['name' => 'Plaquettes frein avant','lifespan_km' => 2000],
        ['name' => 'Plaquettes frein arrière','lifespan_km' => 2000],
        ['name' => 'Pneus',                'lifespan_km' => 5000],
    ];

    public function run(): void
    {
        // ─── Compte 1 : admin de test ────────────────────────────────────
        $alice = User::create([
            'name'     => 'Alice Martin',
            'email'    => 'alice@test.com',
            'password' => Hash::make('password'),
        ]);

        // Vélo 1 — très usé (pour voir les alertes rouges)
        $this->makeBike($alice, 'Trek Émonda SL6', 'route', initialKm: 0, currentKm: 2800);

        // Vélo 2 — neuf
        $this->makeBike($alice, 'Specialized Stumpjumper', 'vtt', initialKm: 0, currentKm: 300);

        // ─── Compte 2 : utilisateur lambda ───────────────────────────────
        $bob = User::create([
            'name'     => 'Bob Dupont',
            'email'    => 'bob@test.com',
            'password' => Hash::make('password'),
        ]);

        $this->makeBike($bob, 'Canyon Grail', 'gravel', initialKm: 500, currentKm: 2100);

        // ─── Compte 3 : compte vide (pour tester l'onboarding) ───────────
        User::create([
            'name'     => 'Charlie Vide',
            'email'    => 'charlie@test.com',
            'password' => Hash::make('password'),
        ]);
    }

    private function makeBike(User $user, string $name, string $type, int $initialKm, int $currentKm): void
    {
        $bike = Bike::create([
            'user_id'    => $user->id,
            'name'       => $name,
            'type'       => $type,
            'initial_km' => $initialKm,
            'current_km' => $currentKm,
        ]);

        foreach ($this->defaultParts as $p) {
            Part::create([
                'bike_id'         => $bike->id,
                'name'            => $p['name'],
                'lifespan_km'     => $p['lifespan_km'],
                'last_changed_km' => $initialKm,
                'current_km'      => $currentKm,
            ]);
        }
    }
}
