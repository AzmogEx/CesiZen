<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Audit extends Model
{
    use HasFactory;

    protected $table = 'audits';

    public const UPDATED_AT = null;

    protected $fillable = [
        'utilisateur_id',
        'action',
        'table_cible',
        'enregistrement_id',
        'anciennes_valeurs',
        'nouvelles_valeurs',
        'ip_address',
    ];

    protected function casts(): array
    {
        return [
            'anciennes_valeurs' => 'array',
            'nouvelles_valeurs' => 'array',
        ];
    }

    // ──── Relations ────

    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class);
    }
}
