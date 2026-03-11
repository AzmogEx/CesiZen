<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SaisieTracker extends Model
{
    use HasFactory;

    protected $table = 'saisie_trackers';

    protected $fillable = [
        'tracker_id',
        'emotion_id',
        'intensite',
        'note',
        'date_saisie',
    ];

    protected function casts(): array
    {
        return [
            'date_saisie' => 'datetime',
            'intensite' => 'integer',
        ];
    }

    // ──── Relations ────

    public function tracker(): BelongsTo
    {
        return $this->belongsTo(Tracker::class);
    }

    public function emotion(): BelongsTo
    {
        return $this->belongsTo(Emotion::class);
    }
}
