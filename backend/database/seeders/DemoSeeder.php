<?php

namespace Database\Seeders;

use App\Models\Emotion;
use App\Models\Role;
use App\Models\SaisieTracker;
use App\Models\Tracker;
use App\Models\Utilisateur;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    /**
     * Compte membre de démonstration + journal pré-rempli.
     *
     * Sert à la soutenance : permet de montrer un journal et des rapports
     * (camembert + courbe) déjà fournis, sans avoir à saisir en direct.
     * Identifiants : demo@cesizen.fr / Demo123!
     */
    public function run(): void
    {
        $roleMembre = Role::where('nom', 'membre')->firstOrFail();

        $demo = Utilisateur::firstOrCreate(
            ['email' => 'demo@cesizen.fr'],
            [
                'nom' => 'Démo',
                'prenom' => 'Camille',
                'email' => 'demo@cesizen.fr',
                'password' => Hash::make('Demo123!'),
                'role_id' => $roleMembre->id,
                'est_actif' => true,
                'consentement_rgpd' => true,
            ]
        );

        $tracker = Tracker::firstOrCreate(
            ['utilisateur_id' => $demo->id],
            ['nom' => 'Mon journal']
        );

        // Idempotent : si le journal de démo est déjà rempli, on ne duplique pas.
        if (SaisieTracker::where('tracker_id', $tracker->id)->exists()) {
            return;
        }

        // Émotions de base (niveau 1) -> couleurs distinctes pour un camembert lisible.
        $emotions = Emotion::where('niveau', 1)->pluck('id', 'nom');

        // 18 saisies réparties sur les 4 dernières semaines (Joie dominante).
        // [jours avant aujourd'hui, émotion, intensité (1-10), note]
        $plan = [
            [25, 'Joie', 7, 'Bonne nouvelle au travail.'],
            [24, 'Surprise', 6, null],
            [22, 'Tristesse', 4, 'Journée un peu morose.'],
            [20, 'Joie', 8, 'Sortie entre amis.'],
            [19, 'Peur', 5, 'Stress avant une présentation.'],
            [17, 'Colère', 6, 'Transports en retard.'],
            [15, 'Joie', 7, null],
            [14, 'Joie', 9, 'Week-end ressourçant.'],
            [12, 'Tristesse', 3, null],
            [11, 'Surprise', 7, 'Visite imprévue.'],
            [9, 'Peur', 4, null],
            [8, 'Joie', 8, 'Objectif atteint.'],
            [6, 'Dégoût', 5, null],
            [5, 'Joie', 7, 'Belle journée.'],
            [3, 'Colère', 4, 'Petite contrariété.'],
            [2, 'Joie', 8, 'Café avec un proche.'],
            [1, 'Peur', 5, 'Nuit agitée.'],
            [0, 'Joie', 9, 'Je me sens bien aujourd\'hui.'],
        ];

        foreach ($plan as [$daysAgo, $nom, $intensite, $note]) {
            SaisieTracker::create([
                'tracker_id' => $tracker->id,
                'emotion_id' => $emotions[$nom],
                'intensite' => $intensite,
                'note' => $note,
                'date_saisie' => now()->subDays($daysAgo)->setTime(20, 0),
            ]);
        }
    }
}
