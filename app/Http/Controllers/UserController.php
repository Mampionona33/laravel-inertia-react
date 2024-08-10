<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct()
    {
        // Appliquer un middleware ou une policy pour restreindre l'accès
        // $this->middleware('can:manage-users');
    }

    /**
     * Afficher la liste des utilisateurs.
     */
    public function index()
    {
        // Nombre d'utilisateurs par page
        $perPage = 5;

        return Inertia::render('Users/Index', [
            'users' => User::where('active', true)->paginate($perPage),
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $this->validateUser($request);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'active' => true,
        ]);

        return redirect()->route('users.index')->with('success', 'Utilisateur créé avec succès.');
    }

    public function edit(User $user)
    {
        return Inertia::render('Users/Edit', [
            'user' => $user,
        ]);
    }

    public function update(User $user, Request $request)
    {
        $this->validateUser($request, $user->id);

        $user->name = $request->name;
        $user->email = $request->email;
        if ($request->password) {
            $user->password = bcrypt($request->password);
        }
        $user->save();

        return redirect()->route('users.index')->with('success', 'Utilisateur mis à jour avec succès.');
    }

    public function showDeleteModal(User $user)
    {
        return Inertia::render('Users/Delete', [
            'user' => $user,
        ]);
    }

    public function deactivate(User $user)
    {
        $user->active = false;
        $user->save();

        return redirect()->route('users.index')->with('success', 'Utilisateur désactivé avec succès.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('users.index')->with('success', 'Utilisateur supprimé avec succès.');
    }

    /**
     * Valider les données utilisateur pour la création ou la mise à jour.
     *
     * @param \Illuminate\Http\Request $request
     * @param int|null $userId
     * @return void
     */
    private function validateUser(Request $request, $userId = null): void
    {
        $rules = [
            'name' => ['required', 'string', 'max:255', 'unique:users,name' . ($userId ? ',' . $userId : '')],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email' . ($userId ? ',' . $userId : '')],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ];

        if ($request->isMethod('post')) {
            // Règles de validation pour la création
            $rules['password'][] = 'required';
        } else {
            // Règles de validation pour la mise à jour
            $rules['password'] = ['nullable', 'string', 'min:8', 'confirmed'];
        }

        $customMessages = [
            'name.required' => 'Le champ nom est obligatoire.',
            'name.unique' => 'Le nom d\'utilisateur est déjà pris.',
            'email.required' => 'Le champ email est obligatoire.',
            'email.unique' => 'L\'email est déjà pris.',
            'password.required' => 'Le champ mot de passe est obligatoire.',
            'password.min' => 'Le champ mot de passe doit contenir au moins 8 caractères.',
            'password.confirmed' => 'Les mots de passe ne correspondent pas.',
        ];

        $request->validate($rules, $customMessages);
    }
}
