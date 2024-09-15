<?php

namespace App\Http\Controllers;

use App\Models\Depense;
use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepenseController extends Controller
{
    public function index(Reservation $reservation)
    {
        $depenseList = Depense::where('reservation_id', $reservation->id)->paginate(3);
        return Inertia::render('Reservations/Account', [
            "depenseList" => $depenseList,
            "activeTab" => "2",
            "reservation" => $reservation
        ]);
    }

    public function store(Request $request, Reservation $reservation)
    {
        $reservationDateFin = Carbon::parse($reservation->date_fin);

        if (Carbon::parse(now()) > $reservationDateFin) {
            return redirect()->back()->withErrors('La réservation est terminée. Vous ne pouvez plus ajouter de dépense.');
        }

        $validatedRequest = $this->validateStore($request);
        $newDepense = Depense::create([
            'reservation_id' => $reservation->id,
            'description' => $validatedRequest->description,
            'amount' => $validatedRequest->amount,
            'date' => now(),
        ]);

        if ($newDepense) {
            return redirect()->back()->with('success', 'Depense ajoutée avec succès');
        }

        return redirect()->back()->with('error', 'Une erreur est survenue');
    }

    private function validateStore(Request $request)
    {

        $request->validate([
            'description' => 'required',
            'amount' => 'required',
        ]);

        $customMessages = [
            'required' => 'Ce champ est requis',
        ];

        $request->validate([
            'description' => 'required',
            'amount' => 'required',
        ], $customMessages);

        return $request;
    }
}
