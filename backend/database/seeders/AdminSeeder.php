<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Utilisateur;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Créer le compte administrateur par défaut.
     */
    public function run(): void
    {
        $roleAdmin = Role::where('nom', 'administrateur')->firstOrFail();

        Utilisateur::firstOrCreate(
            ['email' => 'admin@cesizen.fr'],
            [
                'nom' => 'Admin',
                'prenom' => 'CESIZen',
                'email' => 'admin@cesizen.fr',
                'password' => Hash::make('Admin123!'),
                'role_id' => $roleAdmin->id,
                'est_actif' => true,
                'consentement_rgpd' => true,
            ]
        );
    }
}
