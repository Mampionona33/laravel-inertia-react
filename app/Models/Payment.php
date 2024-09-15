<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_id',
        'amount',
        'due_date',
        'paid_at',
        'payment_method_id', // Référence à la méthode de paiement
        'status',
        // Champs supplémentaires pour les détails spécifiques
        'transaction_reference', // Par exemple, pour Mobile Money
        'phone_number',           // Mobile Money
        'cheque_number',          // Pour les chèques
        'signatory_name',         // Nom du signataire pour les chèques
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class);
    }
}
