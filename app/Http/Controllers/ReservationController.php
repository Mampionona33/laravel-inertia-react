<?php

namespace App\Http\Controllers;

use App\Models\Salle;
use App\Models\Reservation;
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

        // Retourner la vue avec les réservations, les salles réservées et disponibles
        return inertia('Reservations/Index', [
            'reservationsInMonth' => $reservationsInMonth,
            'reservedSalles' => $reservedSalles,
            'availableSalles' => $availableSalles,
            'currentMonth' => $currentMonth,
            'currentYear' => $currentYear,
            'currentSalleId' => $currentSalleId,
            'salles' => Salle::where('active', true)->get(),
            'success' => session('success'),
        ]);
    }


    public function create()
    {
        $salles = Salle::where('active', true)->get();
        return Inertia::render('Reservations/Create', ['salles' => $salles]);
    }

    public function detail(Reservation $reservation)
    {
        return Inertia::render('Reservations/Detail', ['reservation' => $reservation]);
    }

    public function store(Request $request)
    {
        // Appel à la méthode de validation
        $this->validation($request);

        // Si la validation passe, on peut créer la réservation
        $reservation = Reservation::create($request->all());

        // Gestion des paiements
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

        // Redirection avec message de succès
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
