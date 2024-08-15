<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Depense extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_id',
        'description',
        'amount',
        'date',
    ];

    /**
     * Relation avec la table `reservations`.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    /**
     * Casts pour les colonnes.
     */
    protected $casts = [
        'amount' => 'float',
        'date' => 'datetime',
    ];
}
