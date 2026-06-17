<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFeedRequest;
use App\Models\Feed;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class AdminFeedController extends Controller
{
    public function index(): JsonResponse
    {
        $feeds = Feed::with('auteur:id,nom,prenom')
            ->orderBy('ordre')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($feeds);
    }

    public function store(StoreFeedRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['auteur_id'] = auth()->id();
        $data['slug'] = $data['slug'] ?? Str::slug($data['titre']);

        $feed = Feed::create($data);

        return response()->json([
            'message' => 'Contenu créé',
            'feed' => $feed,
        ], 201);
    }

    public function update(StoreFeedRequest $request, int $id): JsonResponse
    {
        $feed = Feed::findOrFail($id);
        $data = $request->validated();

        if (isset($data['titre']) && ! isset($data['slug'])) {
            $data['slug'] = Str::slug($data['titre']);
        }

        $feed->update($data);

        return response()->json([
            'message' => 'Contenu modifié',
            'feed' => $feed,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        Feed::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Contenu supprimé',
        ]);
    }
}
