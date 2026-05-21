<?php

namespace App\Http\Controllers;

use App\Models\Bike;
use App\Models\Part;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BikeController extends Controller
{
    private array $defaultParts = [
        ['name' => 'Chaîne', 'lifespan_km' => 3000],
        ['name' => 'Cassette', 'lifespan_km' => 6000],
        ['name' => 'Plaquettes frein avant', 'lifespan_km' => 2000],
        ['name' => 'Plaquettes frein arrière', 'lifespan_km' => 2000],
        ['name' => 'Pneus', 'lifespan_km' => 5000],
    ];

    public function index(Request $request): JsonResponse
    {
        $bikes = $request->user()->bikes()->with('parts')->get();

        return response()->json($bikes->map(fn($bike) => $this->formatBike($bike)));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:route,vtt,ville,gravel',
            'initial_km' => 'integer|min:0',
        ]);

        $initialKm = $data['initial_km'] ?? 0;

        $bike = $request->user()->bikes()->create([
            'name' => $data['name'],
            'type' => $data['type'],
            'initial_km' => $initialKm,
            'current_km' => $initialKm,
        ]);

        foreach ($this->defaultParts as $part) {
            Part::create([
                'bike_id' => $bike->id,
                'name' => $part['name'],
                'lifespan_km' => $part['lifespan_km'],
                'last_changed_km' => $initialKm,
                'current_km' => $initialKm,
            ]);
        }

        return response()->json($this->formatBike($bike->load('parts')), 201);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $bike = $request->user()->bikes()->with(['parts.histories'])->findOrFail($id);

        return response()->json($this->formatBike($bike));
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $bike = $request->user()->bikes()->findOrFail($id);

        $data = $request->validate([
            'name' => 'string|max:255',
            'type' => 'in:route,vtt,ville,gravel',
        ]);

        $bike->update($data);

        return response()->json($this->formatBike($bike->load('parts')));
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $bike = $request->user()->bikes()->findOrFail($id);
        $bike->delete();

        return response()->json(['message' => 'Vélo supprimé.']);
    }

    private function formatBike(Bike $bike): array
    {
        $parts = $bike->parts ?? collect();
        $avgWear = $parts->isNotEmpty()
            ? (int) round($parts->avg('wear_percentage'))
            : 0;

        return [
            'id' => $bike->id,
            'name' => $bike->name,
            'type' => $bike->type,
            'initial_km' => $bike->initial_km,
            'current_km' => $bike->current_km,
            'wear_percentage' => $avgWear,
            'parts' => $parts->map(fn($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'lifespan_km' => $p->lifespan_km,
                'last_changed_km' => $p->last_changed_km,
                'current_km' => $p->current_km,
                'wear_percentage' => $p->wear_percentage,
                'remaining_km' => $p->remaining_km,
            ]),
            'created_at' => $bike->created_at,
        ];
    }
}
