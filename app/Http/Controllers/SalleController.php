<?php

namespace App\Http\Controllers;

use App\Models\Salle;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SalleController extends Controller
{
    public function __construct()
    {
    }

    public function index()
    {
        $perPage = 5;
        return Inertia::render('Salles/Index', [
            'salles' => Salle::where('active', true)->paginate($perPage),
        ]);
    }

    public function create()
    {
        return Inertia::render('Salles/Create');
    }

    public function edit(Salle $salle): \Inertia\Response
    {
        return Inertia::render('Salles/Edit', [
            'salle' => $salle
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->validation($request);

        $salle = Salle::create([
            'numero' => $request->numero,
            'capacite' => $request->capacite,
            'loyer_journalier' => $request->loyer_journalier,
            'active' => true,
        ]);

        return redirect()->route('salles.index')->with('success', 'Salle ajoutée avec succes.');
    }

    public function update(Salle $salle, Request $request): RedirectResponse
    {
        $this->validation($request, $salle);

        $salle->update([
            'numero' => $request->numero,
            'capacite' => $request->capacite,
            'loyer_journalier' => $request->loyer_journalier,
        ]);

        return redirect()->route('salles.index')->with('success', 'Salle mis à jour avec succes.');
    }

    public function desactivate(Salle $salle): RedirectResponse
    {
        $salle->active = false;
        $salle->save();

        return redirect()->route('salles.index')->with('success', 'Salle desactivée avec succes.');
    }

    private function validation(Request $request, Salle $salle = null): void
    {
        $rules = [
            'numero' => [
                'required',
                'string',
                'max:255',
                'unique:salles,numero' . ($salle ? ',' . $salle->id : '')
            ],
            'capacite' => [
                'required',
                'numeric',
                'max:255'
            ],
            'loyer_journalier' => [
                'nullable',
                'numeric'
            ],
        ];

        $customMessages = [
            'numero.required' => 'Le champ numéro est obligatoire.',
            'numero.unique' => 'Le numéro est déjà pris.',
            'capacite.required' => 'Le champ capacité est obligatoire.',
            'capacite.numeric' => 'Le champ capacité doit être un nombre.',
            'loyer_journalier.numeric' => 'Le champ loyer journalier doit être un nombre.',
        ];

        $request->validate($rules, $customMessages);
    }
}
