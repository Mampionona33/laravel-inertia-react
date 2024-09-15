<?php

namespace App\Http\Controllers;

use App\Models\Depense;
use App\Models\Payment;
use App\Models\Salle;
use App\Models\Reservation;
use App\Services\ExcelExportService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

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
        $salle = Salle::find($reservation->salle_id);
        return Inertia::render('Reservations/Account', [
            'salle' => $salle,
            'reservation' => $reservation,
            "activeTab" => "0"
        ]);
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
        $ref = $this->generateRef();
        return Inertia::render('Reservations/Create', ['salles' => $salles, 'reservationRef' => $ref]);
    }

    private function generateRef(): string
    {
        // Assurer que nous avons une référence maximale valide
        $maxRef =  Reservation::max('ref') ?? null;
        // Extraire le numéro de la référence et s'assurer qu'il est sous forme entière
        $currentMaxNumber = $maxRef ? (int)substr($maxRef, -4) : 0;
        // Générer un nouveau numéro en incrémentant de 1
        $newNumber = $currentMaxNumber + 1;
        // Formater le numéro pour qu'il ait toujours 4 chiffres
        $formattedNumber = str_pad($newNumber, 4, '0', STR_PAD_LEFT);
        // Construire la nouvelle référence
        $ref = 'RS_' . Carbon::today()->format('Ymd') . '_' . $formattedNumber;
        return $ref;
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

    public function showJournalDeCaisse(Request $request)
    {

        $this->validateShowJournal($request);

        $date_debut = $request->has('date_debut') ? Carbon::parse($request->date_debut) : null;
        $date_fin = $request->has('date_fin') ? Carbon::parse($request->date_fin) : null;

        // Récupérer les encaissements
        $cashReceipts = Payment::whereBetween('paid_at', [$date_debut, $date_fin])
            ->get()
            ->map(function ($payment) {
                return [
                    'ref' => $payment->reservation->ref,
                    'description' => 'Accompte pour ' . $payment->reservation->nom_client,
                    'amount' => $payment->amount,
                    'date' => $payment->paid_at,
                    'type' => 'encaissement'
                ];
            });

        // Récupérer les décaissements
        $cashDisbursements = Depense::whereBetween('created_at', [$date_debut, $date_fin])
            ->get()
            ->map(function ($depense) {
                return [
                    'ref' => $depense->reservation ? $depense->reservation->ref : null,  // Vérification si la relation existe
                    'description' => $depense->description,
                    'amount' => $depense->amount,
                    'date' => $depense->created_at,
                    'type' => 'decaissement'
                ];
            });

        // Combiner les encaissements et décaissements dans une collection unique et trier par date
        $journalEntries = $cashReceipts->merge($cashDisbursements)->sortBy('date')->values()->toArray();


        $totalDepenses = $cashDisbursements->sum('amount');
        $totalEncaissements = $cashReceipts->sum('amount');

        // Calculer le total
        $total = $cashReceipts->sum('amount') - $cashDisbursements->sum('amount');

        return Inertia::render('Journal/Index', [
            'journalEntries' => $journalEntries,
            'total' => $total,
            'date_debut' => $date_debut,
            'date_fin' => $date_fin,
            'totalEncaissements' => $totalEncaissements,
            'totalDepenses' => $totalDepenses
        ]);

        return redirect()->back();
    }

    private function validateShowJournal(Request $request)
    {
        $rules = [
            'date_debut' => ['required', 'before_or_equal:date_fin', 'date'],
            'date_fin' => ['required', 'after_or_equal:date_debut', 'date'],
        ];

        $customMessages = [
            'required' => 'Ce champ est requis',
            'date' => 'La date doit être valide',
            'before_or_equal' => 'La date de debut doit être anterieure ou égale à la date de fin.',
            'after_or_equal' => 'La date de fin doit être postérieure ou égale à la date de debut.',
        ];

        $request->validate($rules, $customMessages);

        return $request;
    }

    public function exportJournal(Request $request)
    {
        // Valider les paramètres de requête
        $this->validateShowJournal($request);
        $formatedDateDebut = Carbon::parse($request->date_debut)->format('d/m/Y');
        $formatedDateFin = Carbon::parse($request->date_fin)->format('d/m/Y');

        $date_debut = $request->has('date_debut') ? $formatedDateDebut : null;
        $date_fin = $request->has('date_fin') ? $formatedDateFin : null;

        // Récupérer les encaissements
        $cashReceipts = Payment::whereBetween('paid_at', [$date_debut, $date_fin])
            ->get()
            ->map(function ($payment) {
                return [
                    'ref' => $payment->reservation->ref,
                    'description' => 'Accompte pour ' . $payment->reservation->nom_client,
                    'amount' => $payment->amount,
                    'date' => Carbon::parse($payment->paid_at)->format('d/m/Y'),
                    'type' => 'encaissement'
                ];
            });

        // Récupérer les décaissements
        $cashDisbursements = Depense::whereBetween('created_at', [$date_debut, $date_fin])
            ->get()
            ->map(function ($depense) {
                return [
                    'ref' => $depense->reservation ? $depense->reservation->ref : null,
                    'description' => $depense->description,
                    'amount' => $depense->amount,
                    'date' => Carbon::parse($depense->created_at)->format('d/m/Y'),
                    'type' => 'decaissement'
                ];
            });

        // Combiner les entrées du journal
        $journalEntries = $cashReceipts->merge($cashDisbursements)->sortBy('date')->values()->toArray();

        // Utiliser la méthode statique pour créer la feuille Excel
        $spreadsheet = ExcelExportService::createJournalSheet($journalEntries);

        // Télécharger le fichier Excel
        ExcelExportService::download($spreadsheet, 'journal_du_' . $formatedDateDebut . '_au_' . $formatedDateFin . '.xlsx');
    }
}
