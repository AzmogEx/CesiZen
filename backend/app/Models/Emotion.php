<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Emotion extends Model
{
    use HasFactory;

    protected $table = 'emotions';

    protected $fillable = [
        'nom',
        'couleur',
        'icone',
        'niveau',
        'parent_id',
        'est_actif',
    ];

    protected function casts(): array
    {
        return [
            'niveau' => 'integer',
            'est_actif' => 'boolean',
        ];
    }

    // ──── Relations ────

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Emotion::class, 'parent_id');
    }

    public function enfants(): HasMany
    {
        return $this->hasMany(Emotion::class, 'parent_id');
    }

    public function saisieTrackers(): HasMany
    {
        return $this->hasMany(SaisieTracker::class);
    }

    // ──── Scopes ────

    public function scopeActives(Builder $query): Builder
    {
        return $query->where('est_actif', true);
    }

    public function scopeNiveau(Builder $query, int $niveau): Builder
    {
        return $query->where('niveau', $niveau);
    }
}
