<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;

class CategoriaController extends Controller
{
    /**
    * Mostrar todos los categorias con paginación y opción de búsqueda.
    */
    public function index(Request $request)
    {
        // Consulta los categorias y filtra por nombre si se incluye un término de búsqueda.
        $categorias = Categoria::query()
            ->when($request->search, function ($query, $search) {
            return $query->where('nombre', 'like', "%{$search}%");
            })
            ->paginate(10) // Pagina los resultados de 10 en 10
            ->appends($request->all()); // Conserva los filtros en la URL
        
        // Renderiza la vista 'categoria' usando Inertia con los datos necesarios
        return Inertia::render('categoria', [
            'categorias' => $categorias,
            'filters' => $request->only('search'), // Enviar filtros usados (como "search") a la vista
            'flash' => session()->only(['success']), // Mostrar mensajes flash (como éxito)
        ]);
    }

    /**
    * Mostrar un solo categoria según su ID.
    */
    public function show($id)
    {
        $categoria = Categoria::findOrFail($id); // Busca el categoria o muestra error 404 si no existe
        return response()->json($categoria); // Devuelve el categoria como JSON
    }
    
    /**
    * Guardar un nuevo categoria en la base de datos.
    */
    public function store(Request $request)
    {
        // Validar los datos recibidos del formulario
        $request->validate([
            'nombre' => 'required|string|max:255',
            'codigo' => 'required|string',
        ]);

        // Crear el categoria con los datos validados
        Categoria::create($request->only('nombre', 'codigo'));
        
        // Redirige hacia atrás con un mensaje de éxito
        return redirect()->back()->with('success', 'Categoria creado correctamente.');
    }

    /**
    * Actualizar un categoria existente.
    */
    public function update(Request $request, $id)
    {
        $categoria = Categoria::findOrFail($id); // Verifica que el categoria exista
        
        // Validar los nuevos datos
        $request->validate([
            'nombre' => 'required|string|max:255',
            'codigo' => 'required|string',
            ]);
        
        // Actualizar los datos del categoria
        $Categoria->update($request->only('nombre', 'codigo'));
        return redirect()->back()->with('success', 'Categoria actualizado correctamente.');
    }

    /**
    * Eliminar un categoria de la base de datos.
    */
    public function destroy($id)
    {
        $categoria = Categoria::findOrFail($id); // Asegura que el categoria exista
        $categoria->delete(); // Elimina el categoria
        return redirect()->back()->with('success', 'Categoria eliminado correctamente.');
    }
}
