<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\Role;
use App\Models\Tracker;
use App\Models\Utilisateur;
use Illuminate\Http\JsonResponse;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /**
     * Inscription d'un nouvel utilisateur.
     *
     * Assigne automatiquement le rôle "membre", enregistre le consentement RGPD,
     * crée un tracker par défaut et génère le token JWT.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $role = Role::where('nom', 'membre')->first();

        $utilisateur = Utilisateur::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'password' => $request->password,
            'role_id' => $role->id,
            'consentement_rgpd' => true,
        ]);

        Tracker::create([
            'utilisateur_id' => $utilisateur->id,
            'nom' => 'Mon journal',
        ]);

        $token = JWTAuth::fromUser($utilisateur);
        $utilisateur->load('role');

        return response()->json([
            'message' => 'Inscription réussie',
            'utilisateur' => $utilisateur,
            'token' => $token,
        ], 201);
    }

    /**
     * Authentification d'un utilisateur existant.
     *
     * Vérifie les identifiants, le statut actif du compte et génère un token JWT.
     * Renvoie une erreur 403 si le compte est désactivé/anonymisé.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        if (! $token = auth()->attempt($credentials)) {
            return response()->json([
                'message' => 'Identifiants incorrects',
            ], 401);
        }

        $utilisateur = auth()->user();

        if (! $utilisateur->est_actif) {
            auth()->logout();

            return response()->json([
                'message' => 'Votre compte a été désactivé',
            ], 403);
        }

        $utilisateur->load('role');

        return response()->json([
            'utilisateur' => $utilisateur,
            'token' => $token,
        ]);
    }

    public function logout(): JsonResponse
    {
        auth()->logout();

        return response()->json([
            'message' => 'Déconnexion réussie',
        ]);
    }

    public function me(): JsonResponse
    {
        $utilisateur = auth()->user();
        $utilisateur->load('role');

        return response()->json($utilisateur);
    }

    public function refresh(): JsonResponse
    {
        $token = auth()->refresh();
        $utilisateur = auth()->user();
        $utilisateur->load('role');

        return response()->json([
            'utilisateur' => $utilisateur,
            'token' => $token,
        ]);
    }
}
