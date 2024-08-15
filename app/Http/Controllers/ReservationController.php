<?php

namespace App\Http\Controllers;

use App\Models\Salle;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class ReservationController extends Controller
{
    public function index()
    {
        return Inertia::render('Reservations/Index');
    }

    public function create()
    {
        $salles = Salle::where('active', true)->get();
        return Inertia::render('Reservations/Create', ['salles' => $salles]);
    }

    public function store(Request $request)
    {
        dd($request->all());

        $this->validation($request);

        $reservation = Reservation::create($request->all());


        if ($request->payment_method === 'un_paiement') {
            // Paiement en une seule fois
            $reservation->payments()->create([
                'amount' => $request->total_amount,
                'due_date' => $request->date_debut,
                'status' => 'pending',
            ]);
        } elseif ($request->payment_method === 'tranches') {
            // Paiement en plusieurs tranches
            foreach ($request->installments as $installment) {
                $reservation->payments()->create([
                    'amount' => $installment['amount'],
                    'due_date' => $installment['due_date'],
                    'status' => 'pending',
                ]);
            }
        }

        return redirect()->route('reservations.index')->with('success', 'Réservation créée avec succès.');
    }


    private function validation(Request $request)
    {
        $rules = [
            'salle_id' => ['required'],
            'nom_client' => ['required', 'string', 'max:255'],
            'date_debut' => ['required', 'date', 'before:date_fin'],
            'date_fin' => ['required', 'date', 'after:date_debut'],
            "repas" => ['nullable', 'float', 'max:255'],
        ];

        // Validation de base
        $validatedData = $request->validate($rules);

        // Validation personnalisée : vérifier si la salle est déjà réservée pour la période sélectionnée
        $reservationExist = Reservation::where('salle_id', $request->salle_id)
            ->where(function ($query) use ($request) {
                $query->whereBetween('date_debut', [$request->date_debut, $request->date_fin])
                    ->orWhereBetween('date_fin', [$request->date_debut, $request->date_fin])
                    ->orWhere(function ($query) use ($request) {
                        $query->where('date_debut', '<=', $request->date_debut)
                            ->where('date_fin', '>=', $request->date_fin);
                    });
            })
            ->exists();

        if ($reservationExist) {
            throw ValidationException::withMessages([
                'salle_id' => 'La salle est déjà réservée pour les dates sélectionnées.',
            ]);
        }
    }
}
