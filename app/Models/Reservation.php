<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'salle_id',
        'date_debut',
        'date_fin',
        'ref',
        'nom_client',
        'num_tel',
        'repas',
        'payment_method',
        'total_amount',
    ];

    /**
     * Relation avec la table `payments`.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Relation avec la table `salles`.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function salle()
    {
        return $this->belongsTo(Salle::class, 'salle_id');
    }

    /**
     * Relation avec la table `depenses`.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function depenses()
    {
        return $this->hasMany(Depense::class);
    }

    /**
     * Casts pour les colonnes.
     * Cela assure que certaines colonnes sont automatiquement converties.
     */
    protected $casts = [
        'date_debut' => 'datetime',
        'date_fin' => 'datetime',
        'total_amount' => 'float',
    ];
}
