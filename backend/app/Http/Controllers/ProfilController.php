<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\UpdateProfilRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class ProfilController extends Controller
{
    public function show(): JsonResponse
    {
        $utilisateur = auth()->user();
        $utilisateur->load('role');

        return response()->json($utilisateur);
    }

    public function update(UpdateProfilRequest $request): JsonResponse
    {
        $utilisateur = auth()->user();
        $utilisateur->update($request->validated());
        $utilisateur->load('role');

        return response()->json([
            'message' => 'Profil mis à jour',
            'utilisateur' => $utilisateur,
        ]);
    }

    public function updatePassword(UpdatePasswordRequest $request): JsonResponse
    {
        $utilisateur = auth()->user();

        if (!Hash::check($request->ancien_mot_de_passe, $utilisateur->password)) {
            return response()->json([
                'message' => 'L\'ancien mot de passe est incorrect',
            ], 422);
        }

        $utilisateur->update(['password' => $request->password]);

        return response()->json([
            'message' => 'Mot de passe modifié avec succès',
        ]);
    }

    public function destroy(): JsonResponse
    {
        $utilisateur = auth()->user();
        $utilisateur->delete();
        auth()->logout();

        return response()->json([
            'message' => 'Compte supprimé avec succès',
        ]);
    }
}
