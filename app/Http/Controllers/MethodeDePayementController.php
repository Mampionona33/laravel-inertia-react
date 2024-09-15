<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MethodeDePayementController extends Controller
{
    public function index()
    {
        return Inertia::render('methodeDePayement/Index');
    }
}
