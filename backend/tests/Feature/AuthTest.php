<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\Utilisateur;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_un_visiteur_peut_creer_un_compte(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'nom' => 'Marzuk',
            'prenom' => 'Adam',
            'email' => 'adam@test.fr',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'consentement_rgpd' => true,
        ]);

        $response->assertCreated()
            ->assertJsonStructure(['utilisateur', 'token']);

        $this->assertDatabaseHas('utilisateurs', ['email' => 'adam@test.fr']);
    }

    public function test_un_utilisateur_peut_se_connecter(): void
    {
        $role = Role::where('nom', 'membre')->first();
        Utilisateur::create([
            'nom' => 'Test',
            'prenom' => 'User',
            'email' => 'login@test.fr',
            'password' => 'Password123!',
            'role_id' => $role->id,
            'consentement_rgpd' => true,
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'login@test.fr',
            'password' => 'Password123!',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['utilisateur', 'token']);
    }

    public function test_un_compte_desactive_ne_peut_pas_se_connecter(): void
    {
        $role = Role::where('nom', 'membre')->first();
        Utilisateur::create([
            'nom' => 'Inactif',
            'prenom' => 'User',
            'email' => 'inactif@test.fr',
            'password' => 'Password123!',
            'role_id' => $role->id,
            'consentement_rgpd' => true,
            'est_actif' => false,
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'inactif@test.fr',
            'password' => 'Password123!',
        ]);

        $response->assertForbidden();
    }

    public function test_un_acces_protege_renvoie_401_sans_token(): void
    {
        $this->getJson('/api/v1/profil')->assertUnauthorized();
    }
}
