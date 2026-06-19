<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Feed extends Model
{
    use Auditable, HasFactory;

    protected $table = 'feeds';

    protected $fillable = [
        'titre',
        'slug',
        'contenu',
        'image_url',
        'est_publie',
        'auteur_id',
        'ordre',
    ];

    protected function casts(): array
    {
        return [
            'est_publie' => 'boolean',
            'ordre' => 'integer',
        ];
    }

    // ──── Relations ────

    public function auteur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'auteur_id');
    }

    // ──── Scopes ────

    public function scopePublie(Builder $query): Builder
    {
        return $query->where('est_publie', true);
    }
}
