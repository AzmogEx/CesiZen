<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Insérer les rôles par défaut.
     */
    public function run(): void
    {
        $roles = [
            [
                'nom' => 'visiteur',
                'description' => 'Visiteur anonyme du site',
            ],
            [
                'nom' => 'membre',
                'description' => 'Utilisateur inscrit et connecté',
            ],
            [
                'nom' => 'administrateur',
                'description' => 'Administrateur de la plateforme',
            ],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['nom' => $role['nom']], $role);
        }
    }
}
