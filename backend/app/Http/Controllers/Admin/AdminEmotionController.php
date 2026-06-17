<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Emotion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminEmotionController extends Controller
{
    public function index(): JsonResponse
    {
        $emotions = Emotion::niveau(1)
            ->with(['enfants' => fn ($q) => $q->orderBy('nom')])
            ->orderBy('nom')
            ->get();

        return response()->json($emotions);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'couleur' => 'required|string|max:7',
            'icone' => 'nullable|string|max:10',
            'niveau' => 'required|integer|in:1,2',
            'parent_id' => 'nullable|required_if:niveau,2|exists:emotions,id',
        ]);

        $emotion = Emotion::create($request->only('nom', 'couleur', 'icone', 'niveau', 'parent_id'));

        return response()->json([
            'message' => 'Émotion créée',
            'emotion' => $emotion,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $emotion = Emotion::findOrFail($id);

        $request->validate([
            'nom' => 'sometimes|string|max:255',
            'couleur' => 'sometimes|string|max:7',
            'icone' => 'nullable|string|max:10',
            'est_actif' => 'sometimes|boolean',
        ]);

        $emotion->update($request->only('nom', 'couleur', 'icone', 'est_actif'));

        return response()->json([
            'message' => 'Émotion modifiée',
            'emotion' => $emotion,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $emotion = Emotion::findOrFail($id);
        $emotion->update(['est_actif' => false]);
        $emotion->enfants()->update(['est_actif' => false]);

        return response()->json([
            'message' => 'Émotion désactivée',
        ]);
    }
}
