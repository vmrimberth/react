<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AutorController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\PersonaController;
use App\Http\Controllers\UbicacionController;
use App\Http\Controllers\LibroController;
use App\Http\Controllers\PrestamoLibroController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/autors', [AutorController::class, 'index']); // Obtener todos
    Route::post('/autors', [AutorController::class, 'store']); // Crear nuevo
    Route::get('/autors/{id}', [AutorController::class, 'show']); // Obtener uno
    Route::put('/autors/{id}', [AutorController::class, 'update']); // Actualizar
    Route::delete('/autors/{id}', [AutorController::class, 'destroy']); // Eliminar

    Route::get('/categorias', [CategoriaController::class, 'index']); // Obtener todos
    Route::post('/categorias', [CategoriaController::class, 'store']); // Crear nuevo
    Route::get('/categorias/{id}', [CategoriaController::class, 'show']); // Obtener uno
    Route::put('/categorias/{id}', [CategoriaController::class, 'update']); // Actualizar
    Route::delete('/categorias/{id}', [CategoriaController::class, 'destroy']); // Eliminar

    Route::get('/personas', [PersonaController::class, 'index']); // Obtener todos
    Route::post('/personas', [PersonaController::class, 'store']); // Crear nuevo
    Route::get('/personas/{id}', [PersonaController::class, 'show']); // Obtener uno
    Route::put('/personas/{id}', [PersonaController::class, 'update']); // Actualizar
    Route::delete('/personas/{id}', [PersonaController::class, 'destroy']); // Eliminar

    Route::get('/ubicacions', [UbicacionController::class, 'index']); // Obtener todos
    Route::post('/ubicacions', [UbicacionController::class, 'store']); // Crear nuevo
    Route::get('/ubicacions/{id}', [UbicacionController::class, 'show']); // Obtener uno
    Route::put('/ubicacions/{id}', [UbicacionController::class, 'update']); // Actualizar
    Route::delete('/autubicacionsors/{id}', [UbicacionController::class, 'destroy']); // Eliminar

    Route::get('/libros', [LibroController::class, 'index']); // Obtener todos
    Route::post('/libros', [LibroController::class, 'store']); // Crear nuevo
    Route::get('/libros/{id}', [LibroController::class, 'show']); // Obtener uno
    Route::put('/libros/{id}', [LibroController::class, 'update']); // Actualizar
    Route::delete('/libros/{id}', [LibroController::class, 'destroy']); // Eliminar

    Route::get('/prestamoLibros', [PrestamoLibroController::class, 'index']); // Obtener todos
    Route::post('/prestamoLibros', [PrestamoLibroController::class, 'store']); // Crear nuevo
    Route::get('/prestamoLibros/{id}', [PrestamoLibroController::class, 'show']); // Obtener uno
    Route::put('/prestamoLibros/{id}', [PrestamoLibroController::class, 'update']); // Actualizar
    Route::delete('/prestamoLibros/{id}', [PrestamoLibroController::class, 'destroy']); // Eliminar

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
