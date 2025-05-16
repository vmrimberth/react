<?php

namespace App\Http\Controllers;

use App\Models\PrestamoLibro;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;

class PrestamoLibroController extends Controller
{
    /**
    * Mostrar todos los prestamoLibros con paginación y opción de búsqueda.
    */
    public function index(Request $request)
    {
        // Consulta los prestamoLibros y filtra por título si se incluye un término de búsqueda.
        $prestamoLibros = PrestamoLibro::query()
            ->when($request->search, function ($query, $search) {
            return $query->where('libro_id', '=', "{$search}");
            })
            ->paginate(10) // Pagina los resultados de 10 en 10
            ->appends($request->all()); // Conserva los filtros en la URL
        
        // Renderiza la vista 'prestamoLibro' usando Inertia con los datos necesarios
        return Inertia::render('prestamoLibro', [
            'prestamoLibros' => $prestamoLibros,
            'filters' => $request->only('search'), // Enviar filtros usados (como "search") a la vista
            'flash' => session()->only(['success']), // Mostrar mensajes flash (como éxito)
        ]);
    }

    /**
    * Mostrar un solo prestamoLibro según su ID.
    */
    public function show($id)
    {
        $prestamoLibro = PrestamoLibro::findOrFail($id); // Busca el prestamoLibro o muestra error 404 si no existe
        return response()->json($prestamoLibro); // Devuelve el prestamoLibro como JSON
    }
    
    /**
    * Guardar un nuevo prestamoLibro en la base de datos.
    */
    public function store(Request $request)
    {
        // Validar los datos recibidos del formulario
        $request->validate([
            'libro_id' => 'required',
        ]);

        // Crear el prestamoLibro con los datos validados
        PrestamoLibro::create($request->only('libro_id','persona_id'));
        
        // Redirige hacia atrás con un mensaje de éxito
        return redirect()->back()->with('success', 'PrestamoLibro creado correctamente.');
    }

    /**
    * Actualizar un prestamoLibro existente.
    */
    public function update(Request $request, $id)
    {
        $prestamoLibro = PrestamoLibro::findOrFail($id); // Verifica que el prestamoLibro exista
        
        // Validar los nuevos datos
        $request->validate([
            'libro_id' => 'required',
            ]);
        
            // Actualizar los datos del prestamoLibro
        $prestamoLibro->update($request->only('libro_id','persona_id'));
        return redirect()->back()->with('success', 'PrestamoLibro actualizado correctamente.');
    }

    /**
    * Eliminar un prestamoLibro de la base de datos.
    */
    public function destroy($id)
    {
        $prestamoLibro = PrestamoLibro::findOrFail($id); // Asegura que el prestamoLibro exista
        $prestamoLibro->delete(); // Elimina el prestamoLibro
        return redirect()->back()->with('success', 'PrestamoLibro eliminado correctamente.');
    }
}
