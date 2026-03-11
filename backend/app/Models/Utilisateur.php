<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Utilisateur extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $table = 'utilisateurs';

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'role_id',
        'est_actif',
        'consentement_rgpd',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'est_actif' => 'boolean',
            'consentement_rgpd' => 'boolean',
        ];
    }

    // ──── JWTSubject ────

    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [
            'role' => $this->role->nom,
        ];
    }

    // ──── Relations ────

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function tracker(): HasOne
    {
        return $this->hasOne(Tracker::class);
    }

    public function contactsUrgence(): HasMany
    {
        return $this->hasMany(ContactUrgence::class);
    }

    // ──── Helpers ────

    public function estAdmin(): bool
    {
        return $this->role->nom === 'administrateur';
    }
}
