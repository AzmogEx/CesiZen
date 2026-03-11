<?php

namespace App\Http\Controllers;

use App\Models\Feed;
use Illuminate\Http\JsonResponse;

class FeedController extends Controller
{
    public function index(): JsonResponse
    {
        $feeds = Feed::publie()
            ->orderBy('ordre')
            ->orderBy('created_at', 'desc')
            ->get(['id', 'titre', 'slug', 'contenu', 'image_url', 'ordre', 'created_at']);

        return response()->json($feeds);
    }

    public function show(string $slug): JsonResponse
    {
        $feed = Feed::publie()->where('slug', $slug)->with('auteur:id,nom,prenom')->firstOrFail();

        return response()->json($feed);
    }
}
