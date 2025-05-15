<?php

namespace App\Http\Controllers;

use App\Models\Persona;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;

class PersonaController extends Controller
{
    /**
    * Mostrar todos los personas con paginación y opción de búsqueda.
    */
    public function index(Request $request)
    {
        // Consulta los personas y filtra por título si se incluye un término de búsqueda.
        $personas = Persona::query()
            ->when($request->search, function ($query, $search) {
            return $query->where('nombre', 'like', "%{$search}%");
            })
            ->paginate(10) // Pagina los resultados de 10 en 10
            ->appends($request->all()); // Conserva los filtros en la URL
        
        // Renderiza la vista 'persona' usando Inertia con los datos necesarios
        return Inertia::render('persona', [
            'personas' => $personas,
            'filters' => $request->only('search'), // Enviar filtros usados (como "search") a la vista
            'flash' => session()->only(['success']), // Mostrar mensajes flash (como éxito)
        ]);
    }

    /**
    * Mostrar un solo persona según su ID.
    */
    public function show($id)
    {
        $persona = Persona::findOrFail($id); // Busca el persona o muestra error 404 si no existe
        return response()->json($persona); // Devuelve el persona como JSON
    }
    
    /**
    * Guardar un nuevo persona en la base de datos.
    */
    public function store(Request $request)
    {
        // Validar los datos recibidos del formulario
        $request->validate([
            'nombre' => 'required|string|max:255',
            'codigo' => 'required|string',
        ]);

        // Crear el persona con los datos validados
        Persona::create($request->only('nombre', 'codigo'));
        
        // Redirige hacia atrás con un mensaje de éxito
        return redirect()->back()->with('success', 'Persona creado correctamente.');
    }

    /**
    * Actualizar un persona existente.
    */
    public function update(Request $request, $id)
    {
        $persona = Persona::findOrFail($id); // Verifica que el persona exista
        
        // Validar los nuevos datos
        $request->validate([
            'nombre' => 'required|string|max:255',
            'codigo' => 'required|string',
            ]);
        
            // Actualizar los datos del persona
        $persona->update($request->only('nombre', 'codigo'));
        return redirect()->back()->with('success', 'Persona actualizado correctamente.');
    }

    /**
    * Eliminar un persona de la base de datos.
    */
    public function destroy($id)
    {
        $persona = Persona::findOrFail($id); // Asegura que el persona exista
        $persona->delete(); // Elimina el persona
        return redirect()->back()->with('success', 'Persona eliminado correctamente.');
    }
}
