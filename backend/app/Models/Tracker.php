<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tracker extends Model
{
    use HasFactory;

    protected $table = 'trackers';

    protected $fillable = [
        'utilisateur_id',
        'nom',
    ];

    // ──── Relations ────

    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class);
    }

    public function saisies(): HasMany
    {
        return $this->hasMany(SaisieTracker::class);
    }
}
