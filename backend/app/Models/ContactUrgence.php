<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactUrgence extends Model
{
    use HasFactory;

    protected $table = 'contacts_urgence';

    protected $fillable = [
        'utilisateur_id',
        'nom',
        'telephone',
        'relation',
    ];

    // ──── Relations ────

    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class);
    }
}
