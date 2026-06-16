<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\UpdateProfilRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

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

    // RGPD — Article 20 : droit à la portabilité des données
    public function export(): JsonResponse
    {
        $utilisateur = auth()->user();
        $utilisateur->load(['role', 'tracker.saisies.emotion', 'contactsUrgence']);

        $payload = [
            'export_genere_le' => now()->toIso8601String(),
            'utilisateur' => [
                'id' => $utilisateur->id,
                'nom' => $utilisateur->nom,
                'prenom' => $utilisateur->prenom,
                'email' => $utilisateur->email,
                'role' => $utilisateur->role->nom ?? null,
                'consentement_rgpd' => $utilisateur->consentement_rgpd,
                'est_actif' => $utilisateur->est_actif,
                'cree_le' => $utilisateur->created_at?->toIso8601String(),
                'mis_a_jour_le' => $utilisateur->updated_at?->toIso8601String(),
            ],
            'saisies_tracker' => $utilisateur->tracker
                ? $utilisateur->tracker->saisies->map(fn ($s) => [
                    'date_saisie' => $s->date_saisie?->toIso8601String(),
                    'emotion' => $s->emotion->nom ?? null,
                    'emotion_parent' => $s->emotion->parent->nom ?? null,
                    'intensite' => $s->intensite,
                    'note' => $s->note,
                ])->values()
                : [],
        ];

        return response()->json($payload)
            ->header('Content-Disposition', 'attachment; filename="cesizen-export-'.$utilisateur->id.'.json"');
    }

    // RGPD — Article 17 : alternative à la suppression définitive — anonymisation
    public function anonymiser(): JsonResponse
    {
        $utilisateur = auth()->user();

        DB::transaction(function () use ($utilisateur) {
            $pseudo = 'anonyme_'.Str::random(10);
            $utilisateur->update([
                'nom' => 'Anonyme',
                'prenom' => 'Utilisateur',
                'email' => $pseudo.'@anonymise.cesizen.local',
                'password' => Hash::make(Str::random(40)),
                'est_actif' => false,
                'consentement_rgpd' => false,
            ]);

            $utilisateur->contactsUrgence()->delete();

            if ($utilisateur->tracker) {
                $utilisateur->tracker->saisies()->update(['note' => null]);
            }
        });

        auth()->logout();

        return response()->json([
            'message' => 'Compte anonymisé. Vos données personnelles ont été effacées et vos saisies dépersonnalisées.',
        ]);
    }
}
