<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tracker;
use App\Models\Utilisateur;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminUtilisateurController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Utilisateur::with('role');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                    ->orWhere('prenom', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('role')) {
            $query->whereHas('role', fn ($q) => $q->where('nom', $request->role));
        }

        $utilisateurs = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($utilisateurs);
    }

    public function show(int $id): JsonResponse
    {
        $utilisateur = Utilisateur::with('role')->findOrFail($id);

        return response()->json($utilisateur);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:utilisateurs,email',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id',
        ]);

        $utilisateur = Utilisateur::create($request->only('nom', 'prenom', 'email', 'password', 'role_id'));

        Tracker::create([
            'utilisateur_id' => $utilisateur->id,
            'nom' => 'Mon journal',
        ]);

        $utilisateur->load('role');

        return response()->json([
            'message' => 'Utilisateur créé',
            'utilisateur' => $utilisateur,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $utilisateur = Utilisateur::findOrFail($id);

        $request->validate([
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'email' => "sometimes|email|unique:utilisateurs,email,{$id}",
            'role_id' => 'sometimes|exists:roles,id',
        ]);

        $utilisateur->update($request->only('nom', 'prenom', 'email', 'role_id'));
        $utilisateur->load('role');

        return response()->json([
            'message' => 'Utilisateur modifié',
            'utilisateur' => $utilisateur,
        ]);
    }

    public function toggleActive(int $id): JsonResponse
    {
        if (auth()->id() === $id) {
            return response()->json(['message' => 'Vous ne pouvez pas désactiver votre propre compte.'], 422);
        }

        $utilisateur = Utilisateur::findOrFail($id);
        $utilisateur->update(['est_actif' => ! $utilisateur->est_actif]);

        return response()->json([
            'message' => $utilisateur->est_actif ? 'Compte activé' : 'Compte désactivé',
            'utilisateur' => $utilisateur,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        if (auth()->id() === $id) {
            return response()->json(['message' => 'Vous ne pouvez pas supprimer votre propre compte administrateur.'], 422);
        }

        $utilisateur = Utilisateur::findOrFail($id);
        $utilisateur->delete();

        return response()->json([
            'message' => 'Utilisateur supprimé',
        ]);
    }
}
