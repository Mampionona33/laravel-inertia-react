<?php

namespace App\Http\Controllers;

use App\Models\User;
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
        $perPage = 7;

        return Inertia::render('Users/Index', [
            'users' => User::paginate($perPage),
        ]);
    }


    public function create()
    {
        return Inertia::render('Users/Create');
    }
}
