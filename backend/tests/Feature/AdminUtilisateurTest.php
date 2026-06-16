<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\Utilisateur;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class AdminUtilisateurTest extends TestCase
{
    use RefreshDatabase;

    protected Utilisateur $admin;
    protected Utilisateur $membre;
    protected string $tokenAdmin;
    protected string $tokenMembre;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);

        $roleAdmin = Role::where('nom', 'administrateur')->first();
        $roleMembre = Role::where('nom', 'membre')->first();

        $this->admin = Utilisateur::create([
            'nom' => 'Admin', 'prenom' => 'Super', 'email' => 'admin@test.fr',
            'password' => 'Admin123!', 'role_id' => $roleAdmin->id, 'consentement_rgpd' => true,
        ]);
        $this->membre = Utilisateur::create([
            'nom' => 'Membre', 'prenom' => 'Lambda', 'email' => 'membre@test.fr',
            'password' => 'Password123!', 'role_id' => $roleMembre->id, 'consentement_rgpd' => true,
        ]);

        $this->tokenAdmin = JWTAuth::fromUser($this->admin);
        $this->tokenMembre = JWTAuth::fromUser($this->membre);
    }

    public function test_un_admin_peut_lister_les_utilisateurs(): void
    {
        $this->withHeaders(['Authorization' => 'Bearer '.$this->tokenAdmin])
            ->getJson('/api/v1/admin/utilisateurs')
            ->assertOk();
    }

    public function test_un_membre_ne_peut_pas_acceder_a_l_admin(): void
    {
        $this->withHeaders(['Authorization' => 'Bearer '.$this->tokenMembre])
            ->getJson('/api/v1/admin/utilisateurs')
            ->assertForbidden();
    }

    public function test_un_admin_peut_desactiver_un_compte(): void
    {
        $this->withHeaders(['Authorization' => 'Bearer '.$this->tokenAdmin])
            ->patchJson('/api/v1/admin/utilisateurs/'.$this->membre->id.'/toggle-active')
            ->assertOk();

        $this->assertFalse($this->membre->fresh()->est_actif);
    }

    public function test_un_admin_peut_supprimer_un_compte_soft_delete(): void
    {
        $this->withHeaders(['Authorization' => 'Bearer '.$this->tokenAdmin])
            ->deleteJson('/api/v1/admin/utilisateurs/'.$this->membre->id)
            ->assertOk();

        $this->assertSoftDeleted('utilisateurs', ['id' => $this->membre->id]);
    }

    public function test_endpoint_export_rgpd_renvoie_les_donnees_utilisateur(): void
    {
        $this->withHeaders(['Authorization' => 'Bearer '.$this->tokenMembre])
            ->getJson('/api/v1/profil/export')
            ->assertOk()
            ->assertJsonStructure(['export_genere_le', 'utilisateur', 'saisies_tracker']);
    }
}
