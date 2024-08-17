<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\SalleController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})
    ->middleware(['auth', 'verified'])->name('dashboard');
// ->name('dashboard')

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/users/list', [UserController::class, 'index'])->name('users.index')->middleware(['auth', 'verified']);
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create')->middleware(['auth', 'verified']);
    Route::post('/users', [UserController::class, 'store'])->name('users.store')->middleware(['auth', 'verified']);
    Route::get('/users/{user?}/edit', [UserController::class, 'edit'])->name('users.edit')->middleware(['auth', 'verified']);
    Route::patch('/users/{user}', [UserController::class, 'update'])->name('users.update')->middleware(['auth', 'verified']);
    Route::get('/users/{user}/delete', [UserController::class, 'showDeleteModal'])
        ->name('users.delete')
        ->middleware(['auth', 'verified']);
    Route::post('/users/{user}/delete', [UserController::class, 'deactivate'])->name('users.deactivate')->middleware(['auth', 'verified']);
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');


    Route::get('/salles/list', [SalleController::class, 'index'])->name('salles.index')->middleware(['auth', 'verified']);
    Route::get('/salles/create', [SalleController::class, 'create'])->name('salles.create')->middleware(['auth', 'verified']);
    Route::post('/salles', [SalleController::class, 'store'])->name('salles.store')->middleware(['auth', 'verified']);
    Route::get('/salles/{salle?}/edit', [SalleController::class, 'edit'])->name('salles.edit')->middleware(['auth', 'verified']);
    Route::patch('/salles/{salle}', [SalleController::class, 'update'])->name('salles.update')->middleware(['auth', 'verified']);
    Route::post('/salles/{salle}/desactivate', [SalleController::class, 'desactivate'])->name('salles.desactivate')->middleware(['auth', 'verified']);


    Route::get('/reservations', [ReservationController::class, 'index'])->name('reservations.index')->middleware(['auth', 'verified']);
    Route::get('/reservation/create', [ReservationController::class, 'create'])->name('reservations.create')->middleware(['auth', 'verified']);
    Route::post('/reservation', [ReservationController::class, 'store'])->name('reservations.store')->middleware(['auth', 'verified']);
});


Route::get('/uikit/button', function () {
    return Inertia::render('main/uikit/button/page');
})->name('button');


require __DIR__ . '/auth.php';
