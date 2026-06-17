<?php

namespace Tests\Feature;

use App\Models\Emotion;
use App\Models\Role;
use App\Models\Tracker;
use App\Models\Utilisateur;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class TrackerTest extends TestCase
{
    use RefreshDatabase;

    protected Utilisateur $utilisateur;

    protected Emotion $emotion;

    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);

        $this->emotion = Emotion::create([
            'nom' => 'Joie',
            'couleur' => '#FFD700',
            'niveau' => 1,
            'est_actif' => true,
        ]);

        $role = Role::where('nom', 'membre')->first();
        $this->utilisateur = Utilisateur::create([
            'nom' => 'Test',
            'prenom' => 'User',
            'email' => 'tracker@test.fr',
            'password' => 'Password123!',
            'role_id' => $role->id,
            'consentement_rgpd' => true,
        ]);
        Tracker::create(['utilisateur_id' => $this->utilisateur->id, 'nom' => 'Mon journal']);

        $this->token = JWTAuth::fromUser($this->utilisateur);
    }

    private function authHeaders(): array
    {
        return ['Authorization' => 'Bearer '.$this->token];
    }

    public function test_utilisateur_peut_creer_une_saisie(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/v1/tracker/saisies', [
                'emotion_id' => $this->emotion->id,
                'intensite' => 7,
                'note' => 'Bonne journée',
                'date_saisie' => '2026-05-15',
            ]);

        $response->assertCreated()
            ->assertJsonPath('saisie.intensite', 7);

        $this->assertDatabaseHas('saisie_trackers', ['intensite' => 7]);
    }

    public function test_intensite_doit_etre_entre_1_et_10(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/v1/tracker/saisies', [
                'emotion_id' => $this->emotion->id,
                'intensite' => 15,
                'date_saisie' => '2026-05-15',
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['intensite']);
    }

    public function test_utilisateur_peut_lister_ses_saisies(): void
    {
        $this->utilisateur->tracker->saisies()->create([
            'emotion_id' => $this->emotion->id,
            'intensite' => 5,
            'date_saisie' => '2026-05-15',
        ]);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/v1/tracker/saisies');

        $response->assertOk();
    }

    public function test_utilisateur_peut_supprimer_sa_saisie(): void
    {
        $saisie = $this->utilisateur->tracker->saisies()->create([
            'emotion_id' => $this->emotion->id,
            'intensite' => 5,
            'date_saisie' => '2026-05-15',
        ]);

        $this->withHeaders($this->authHeaders())
            ->deleteJson('/api/v1/tracker/saisies/'.$saisie->id)
            ->assertOk();

        $this->assertDatabaseMissing('saisie_trackers', ['id' => $saisie->id]);
    }
}
