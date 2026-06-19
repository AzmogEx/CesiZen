<?php

namespace Tests\Feature;

use App\Models\Audit;
use App\Models\Feed;
use App\Models\Role;
use App\Models\Utilisateur;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuditTest extends TestCase
{
    use RefreshDatabase;

    protected Utilisateur $auteur;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);

        $role = Role::where('nom', 'membre')->first();
        $this->auteur = Utilisateur::create([
            'nom' => 'Audit',
            'prenom' => 'Test',
            'email' => 'audit@test.fr',
            'password' => 'Password123!',
            'role_id' => $role->id,
            'consentement_rgpd' => true,
        ]);
    }

    private function creerFeed(array $attributs = []): Feed
    {
        return Feed::create(array_merge([
            'titre' => 'Article test',
            'slug' => 'article-test-'.uniqid(),
            'contenu' => 'Contenu',
            'est_publie' => true,
            'ordre' => 1,
            'auteur_id' => $this->auteur->id,
        ], $attributs));
    }

    public function test_la_creation_d_un_feed_genere_un_audit(): void
    {
        $feed = $this->creerFeed();

        $this->assertDatabaseHas('audits', [
            'action' => 'creation',
            'table_cible' => 'feeds',
            'enregistrement_id' => $feed->id,
        ]);
    }

    public function test_la_modification_genere_un_audit_avec_anciennes_et_nouvelles_valeurs(): void
    {
        $feed = $this->creerFeed(['titre' => 'Avant']);

        $feed->update(['titre' => 'Apres']);

        $audit = Audit::where('action', 'modification')
            ->where('enregistrement_id', $feed->id)
            ->first();

        $this->assertNotNull($audit);
        $this->assertSame('Avant', $audit->anciennes_valeurs['titre']);
        $this->assertSame('Apres', $audit->nouvelles_valeurs['titre']);
    }

    public function test_la_suppression_genere_un_audit(): void
    {
        $feed = $this->creerFeed();
        $id = $feed->id;
        $feed->delete();

        $this->assertDatabaseHas('audits', [
            'action' => 'suppression',
            'table_cible' => 'feeds',
            'enregistrement_id' => $id,
        ]);
    }

    public function test_le_mot_de_passe_n_est_pas_stocke_dans_l_audit(): void
    {
        $audit = Audit::where('table_cible', 'utilisateurs')
            ->where('enregistrement_id', $this->auteur->id)
            ->first();

        $this->assertNotNull($audit);
        $this->assertArrayNotHasKey('password', $audit->nouvelles_valeurs);
        $this->assertArrayNotHasKey('remember_token', $audit->nouvelles_valeurs);
    }
}
