<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Salle;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    //
    public function index(Reservation $reservation)
    {
        $accountList = Payment::where('reservation_id', $reservation->id)->paginate(10);
        $salle = Salle::find($reservation->salle_id);

        if (!$salle) {
            abort(404, 'Salle introuvable');
        }

        return Inertia::render('Reservations/Account', [
            'reservation' => $reservation,
            'accountList' => $accountList,
            'salle' => $salle,
            "activeTab" => "1"
        ]);
    }


    public function pay(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:payments,id',
        ]);

        // Récupérer le paiement
        $payment = Payment::findOrFail($request->id);

        // Mettre à jour les détails du paiement
        $payment->update([
            'paid_at' => now(),
            'status' => 'paid',
        ]);

        // Rediriger vers la page du compte avec l'ID de la réservation
        return redirect()->route('reservations.account', ['reservation' => $request->reservation])
            ->with('success', 'Le paiement a été effectué avec succès.');
    }
}
