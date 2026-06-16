<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSaisieRequest;
use App\Models\SaisieTracker;
use App\Services\RapportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SaisieTrackerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $tracker = auth()->user()->tracker;

        if (!$tracker) {
            return response()->json([]);
        }

        $query = $tracker->saisies()->with('emotion.parent')->orderBy('date_saisie', 'desc');

        if ($request->filled('date_debut')) {
            $query->where('date_saisie', '>=', $request->date_debut);
        }
        if ($request->filled('date_fin')) {
            $query->where('date_saisie', '<=', $request->date_fin);
        }
        if ($request->filled('emotion_id')) {
            $query->where('emotion_id', $request->emotion_id);
        }

        $saisies = $query->paginate(20);

        return response()->json($saisies);
    }

    public function store(StoreSaisieRequest $request): JsonResponse
    {
        $tracker = auth()->user()->tracker;

        if (!$tracker) {
            $tracker = auth()->user()->tracker()->create(['nom' => 'Mon journal']);
        }

        $saisie = $tracker->saisies()->create($request->validated());
        $saisie->load('emotion');

        return response()->json([
            'message' => 'Saisie enregistrée',
            'saisie' => $saisie,
        ], 201);
    }

    public function update(StoreSaisieRequest $request, int $id): JsonResponse
    {
        $saisie = auth()->user()->tracker->saisies()->findOrFail($id);
        $saisie->update($request->validated());
        $saisie->load('emotion');

        return response()->json([
            'message' => 'Saisie modifiée',
            'saisie' => $saisie,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $saisie = auth()->user()->tracker->saisies()->findOrFail($id);
        $saisie->delete();

        return response()->json([
            'message' => 'Saisie supprimée',
        ]);
    }

    public function rapports(Request $request, RapportService $rapportService): JsonResponse
    {
        $request->validate([
            'period' => 'sometimes|in:week,month,quarter,year',
        ]);

        $period = $request->get('period', 'month');
        $rapport = $rapportService->genererRapport(auth()->user(), $period);

        return response()->json($rapport);
    }
}
