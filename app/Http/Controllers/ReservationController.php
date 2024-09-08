<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Salle;
use App\Models\Reservation;
use Carbon\Carbon;
use Faker\Core\Number;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        // Récupérer les paramètres du mois, de l'année et de la salle
        $currentMonth = $request->query('month', now()->month);
        $currentYear = $request->query('year', now()->year);
        $currentSalleId = $request->query('salle_id', null);

        if ($currentSalleId && !$this->isSalleIdExists($currentSalleId)) {
            // page not found
            abort(404, 'Salle introuvable');
        }


        // Déterminer les dates de début et de fin du mois spécifié
        $startOfMonth = now()->setYear($currentYear)->setMonth($currentMonth)->startOfMonth()->toDateString();
        $endOfMonth = now()->setYear($currentYear)->setMonth($currentMonth)->endOfMonth()->toDateString();

        // Requête pour récupérer les réservations chevauchant le mois spécifié
        $reservationsInMonth = Reservation::where(function ($query) use ($startOfMonth, $endOfMonth) {
            $query->whereBetween('date_debut', [$startOfMonth, $endOfMonth])
                ->orWhereBetween('date_fin', [$startOfMonth, $endOfMonth])
                ->orWhere(function ($query) use ($startOfMonth, $endOfMonth) {
                    $query->where('date_debut', '<=', $startOfMonth)
                        ->where('date_fin', '>=', $endOfMonth);
                });
        })
            ->when($currentSalleId, function ($query, $currentSalleId) {
                return $query->where('salle_id', $currentSalleId);
            })
            ->get();

        // Récupérer la liste des salles réservées pour la période spécifiée
        $reservedSalleIds = $reservationsInMonth->pluck('salle_id');

        // Obtenir la liste des salles réservées
        $reservedSalles = Salle::whereIn('id', $reservedSalleIds)->get();

        // Obtenir la liste des salles non réservées
        $availableSalles = Salle::whereNotIn('id', $reservedSalleIds)->get();

        $listReservationHasLatePayments = $this->getReservationsWithLatePayments();

        $listPaidReservations = $this->getPaidReservations();

        // Retourner la vue avec les réservations, les salles réservées et disponibles
        return inertia('Reservations/Index', [
            'reservationsInMonth' => $reservationsInMonth,
            'reservedSalles' => $reservedSalles,
            'availableSalles' => $availableSalles,
            'currentMonth' => $currentMonth,
            'currentYear' => $currentYear,
            'currentSalleId' => $currentSalleId,
            'listReservationHasLatePayments' => $listReservationHasLatePayments,
            'listPaidReservations' => $listPaidReservations,
            'salles' => Salle::where('active', true)->get(),
            'success' => session('success'),
        ]);
    }

    public function show(Reservation $reservation)
    {
        return Inertia::render('Reservations/Account', []);
    }

    private function isSalleIdExists($salleId): bool
    {
        return Salle::where('id', $salleId)->exists();
    }

    private function getReservationsWithLatePayments()
    {
        $today = Carbon::now()->toDateString();

        // Récupérer les réservations qui ont des paiements en retard
        $reservationsWithLatePayments = Reservation::whereHas('payments', function ($query) use ($today) {
            $query->where('status', 'pending')
                ->where('due_date', '<', $today);
        })->with(['payments' => function ($query) use ($today) {
            // Charger uniquement les paiements en retard
            $query->where('status', 'pending')
                ->where('due_date', '<', $today);
        }])->get();

        return $reservationsWithLatePayments;
    }

    private function getPaidReservations()
    {
        $paidReservations = Reservation::whereHas('payments', function ($query) {
            // Filtrer les réservations qui ont au moins un paiement avec le statut "paid"
            $query->where('status', 'paid');
        })->with(['payments' => function ($query) {
            // Charger uniquement les paiements avec le statut "paid"
            $query->where('status', 'paid');
        }])->get();

        return $paidReservations;
    }

    public function create()
    {
        $salles = Salle::where('active', true)->get();
        return Inertia::render('Reservations/Create', ['salles' => $salles]);
    }


    public function store(Request $request)
    {
        $this->validation($request);

        $reservation = Reservation::create($request->all());


        // Gestion des paiements
        $installments = $request->input('installments', []);
        if (count($installments) === 0) {
            $reservation->payments()->create([
                'amount' => $request->total_amount,
                'due_date' => $request->date_debut,
                'status' => 'pending',
            ]);
        } else {
            foreach ($request->installments as $installment) {
                $reservation->payments()->create([
                    'amount' => $installment['amount'],
                    'due_date' => Carbon::parse($installment['due_date'])->format('Y-m-d'),
                    'status' => 'pending',
                ]);
            }
        }

        return redirect()->route('reservations.index')->with('success', 'Réservation créée avec succès.');
    }

    private function validation(Request $request)
    {
        // Règles de validation
        $rules = [
            'ref' => ['required', 'string', 'max:255', 'unique:reservations,ref'],
            'salle_id' => ['required'],
            'nom_client' => ['required', 'string', 'max:255'],
            'date_debut' => ['required', 'date', 'before_or_equal:date_fin'],
            'date_fin' => ['required', 'date', 'after_or_equal:date_debut'],
            'repas' => ['nullable', 'numeric'],
        ];

        // Messages d'erreur personnalisés
        $customMessages = [
            'ref.required' => 'Le rèf. est obligatoire.',
            'ref.unique' => 'La référence est déjà pris.',
            'ref.max' => 'Le numéro doit contenir au plus 255 caractères.',
            'salle_id.required' => 'La salle est obligatoire.',
            'nom_client.required' => 'Le nom du client est obligatoire.',
            'date_debut.required' => 'La date de début est obligatoire.',
            'date_fin.required' => 'La date de fin est obligatoire.',
            'repas.numeric' => 'Le montant du repas doit être un nombre.',
            'repas.max' => 'Le montant du repas doit être inférieur ou égal à 255.',
            'date_debut.before_or_equal' => 'La date de début doit être antérieure ou égale à la date de fin.',
            'date_fin.after_or_equal' => 'La date de fin doit être postérieure ou égale à la date de début.',
        ];

        // Validation de base
        $request->validate($rules, $customMessages);

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
