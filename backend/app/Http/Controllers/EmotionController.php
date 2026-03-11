<?php

namespace App\Http\Controllers;

use App\Models\Emotion;
use Illuminate\Http\JsonResponse;

class EmotionController extends Controller
{
    public function index(): JsonResponse
    {
        $emotions = Emotion::actives()
            ->niveau(1)
            ->with(['enfants' => function ($query) {
                $query->actives()->orderBy('nom');
            }])
            ->orderBy('nom')
            ->get();

        return response()->json($emotions);
    }
}
