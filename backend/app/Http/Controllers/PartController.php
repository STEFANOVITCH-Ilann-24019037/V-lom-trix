<?php

namespace App\Http\Controllers;

use App\Models\Part;
use App\Models\PartHealthHistory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PartController extends Controller
{
    public function index(Request $request, string $bikeId): JsonResponse
    {
        $bike = $request->user()->bikes()->findOrFail($bikeId);

        return response()->json($bike->parts->map(fn($p) => $this->formatPart($p)));
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $part = $this->findAuthorizedPart($request, $id);

        $data = $request->validate([
            'lifespan_km' => 'integer|min:100',
            'name' => 'string|max:255',
        ]);

        $part->update($data);

        return response()->json($this->formatPart($part->fresh()));
    }

    public function change(Request $request, string $id): JsonResponse
    {
        $part = $this->findAuthorizedPart($request, $id);

        PartHealthHistory::create([
            'part_id' => $part->id,
            'km_recorded' => $part->current_km,
            'wear_percentage' => $part->wear_percentage,
            'recorded_at' => now(),
        ]);

        $part->update(['last_changed_km' => $part->current_km]);

        return response()->json([
            'message' => 'Pièce remise à zéro.',
            'part' => $this->formatPart($part->fresh()),
        ]);
    }

    private function findAuthorizedPart(Request $request, string $id): Part
    {
        $part = Part::findOrFail($id);

        abort_if($part->bike->user_id !== $request->user()->id, 403, 'Accès non autorisé.');

        return $part;
    }

    private function formatPart(Part $part): array
    {
        return [
            'id' => $part->id,
            'bike_id' => $part->bike_id,
            'name' => $part->name,
            'lifespan_km' => $part->lifespan_km,
            'last_changed_km' => $part->last_changed_km,
            'current_km' => $part->current_km,
            'wear_percentage' => $part->wear_percentage,
            'remaining_km' => $part->remaining_km,
        ];
    }
}
