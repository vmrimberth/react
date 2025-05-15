<?php

namespace App\Http\Controllers;

use App\Models\Autor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;

class AutorController extends Controller
{
    /**
    * Mostrar todos los autores con paginación y opción de búsqueda.
    */
    public function index(Request $request)
    {
        // Consulta los autores y filtra por nombre si se incluye un término de búsqueda.
        $autors = Autor::query()
            ->when($request->search, function ($query, $search) {
            return $query->where('nombre', 'like', "%{$search}%");
            })
            ->paginate(10) // Pagina los resultados de 10 en 10
            ->appends($request->all()); // Conserva los filtros en la URL
        
        // Renderiza la vista 'autor' usando Inertia con los datos necesarios
        return Inertia::render('autor', [
            'autors' => $autors,
            'filters' => $request->only('search'), // Enviar filtros usados (como "search") a la vista
            'flash' => session()->only(['success']), // Mostrar mensajes flash (como éxito)
        ]);
    }

    /**
    * Mostrar un solo autor según su ID.
    */
    public function show($id)
    {
        $autor = Autor::findOrFail($id); // Busca el autor o muestra error 404 si no existe
        return response()->json($autor); // Devuelve el autor como JSON
    }
    
    /**
    * Guardar un nuevo autor en la base de datos.
    */
    public function store(Request $request)
    {
        // Validar los datos recibidos del formulario
        $request->validate([
            'nombre' => 'required|string|max:255',
        ]);

        // Crear el autor con los datos validados
        Autor::create($request->only('nombre'));
        
        // Redirige hacia atrás con un mensaje de éxito
        return redirect()->back()->with('success', 'Autor creado correctamente.');
    }

    /**
    * Actualizar un autor existente.
    */
    public function update(Request $request, $id)
    {
        $autor = Autor::findOrFail($id); // Verifica que el autor exista
        
        // Validar los nuevos datos
        $request->validate([
            'nombre' => 'required|string|max:255',
            ]);
        
            // Actualizar los datos del autor
        $autor->update($request->only('nombre'));
        return redirect()->back()->with('success', 'Autor actualizado correctamente.');
    }

    /**
    * Eliminar un autor de la base de datos.
    */
    public function destroy($id)
    {
        $autor = Autor::findOrFail($id); // Asegura que el autor exista
        $autor->delete(); // Elimina el autor
        return redirect()->back()->with('success', 'Autor eliminado correctamente.');
    }
}
