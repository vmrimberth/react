<?php

namespace App\Http\Controllers;

use App\Models\Ubicacion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;

class UbicacionController extends Controller
{
    /**
    * Mostrar todos los ubicacions con paginación y opción de búsqueda.
    */
    public function index(Request $request)
    {
        // Consulta los ubicacions y filtra por título si se incluye un término de búsqueda.
        $ubicacions = Ubicacion::query()
            ->when($request->search, function ($query, $search) {
            return $query->where('estante', 'like', "%{$search}%");
            })
            ->paginate(10) // Pagina los resultados de 10 en 10
            ->appends($request->all()); // Conserva los filtros en la URL
        
        // Renderiza la vista 'ubicacion' usando Inertia con los datos necesarios
        return Inertia::render('ubicacion', [
            'ubicacions' => $ubicacions,
            'filters' => $request->only('search'), // Enviar filtros usados (como "search") a la vista
            'flash' => session()->only(['success']), // Mostrar mensajes flash (como éxito)
        ]);
    }

    /**
    * Mostrar un solo ubicacion según su ID.
    */
    public function show($id)
    {
        $ubicacion = Ubicacion::findOrFail($id); // Busca el ubicacion o muestra error 404 si no existe
        return response()->json($ubicacion); // Devuelve el ubicacion como JSON
    }
    
    /**
    * Guardar un nuevo ubicacion en la base de datos.
    */
    public function store(Request $request)
    {
        // Validar los datos recibidos del formulario
        $request->validate([
            'estante' => 'required|string|max:255',
            'fila' => 'required|string',
            'columna' => 'required|string',
        ]);

        // Crear el ubicacion con los datos validados
        Ubicacion::create($request->only('estante', 'fila', 'columna'));
        
        // Redirige hacia atrás con un mensaje de éxito
        return redirect()->back()->with('success', 'Ubicacion creado correctamente.');
    }

    /**
    * Actualizar un ubicacion existente.
    */
    public function update(Request $request, $id)
    {
        $ubicacion = Ubicacion::findOrFail($id); // Verifica que el ubicacion exista
        
        // Validar los nuevos datos
        $request->validate([
            'estante' => 'required|string|max:255',
            'fila' => 'required|string',
            'columna' => 'required|string',
            ]);
        
            // Actualizar los datos del ubicacion
        $ubicacion->update($request->only('estante', 'fila', 'columna'));
        return redirect()->back()->with('success', 'Ubicacion actualizado correctamente.');
    }

    /**
    * Eliminar un ubicacion de la base de datos.
    */
    public function destroy($id)
    {
        $ubicacion = Ubicacion::findOrFail($id); // Asegura que el ubicacion exista
        $ubicacion->delete(); // Elimina el ubicacion
        return redirect()->back()->with('success', 'Ubicacion eliminado correctamente.');
    }
}
