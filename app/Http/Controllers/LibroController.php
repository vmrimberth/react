<?php

namespace App\Http\Controllers;

use App\Models\Libro;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;

class LibroController extends Controller
{
    /**
    * Mostrar todos los libros con paginación y opción de búsqueda.
    */
    public function index(Request $request)
    {
        // Consulta los libros y filtra por título si se incluye un término de búsqueda.
        $libros = Libro::query()
            ->when($request->search, function ($query, $search) {
            return $query->where('titulo', 'like', "%{$search}%");
            })
            ->paginate(10) // Pagina los resultados de 10 en 10
            ->appends($request->all()); // Conserva los filtros en la URL
        
        // Renderiza la vista 'libro' usando Inertia con los datos necesarios
        return Inertia::render('libro', [
            'libros' => $libros,
            'filters' => $request->only('search'), // Enviar filtros usados (como "search") a la vista
            'flash' => session()->only(['success']), // Mostrar mensajes flash (como éxito)
        ]);
    }

    /**
    * Mostrar un solo libro según su ID.
    */
    public function show($id)
    {
        $libro = Libro::findOrFail($id); // Busca el libro o muestra error 404 si no existe
        return response()->json($libro); // Devuelve el libro como JSON
    }
    
    /**
    * Guardar un nuevo libro en la base de datos.
    */
    public function store(Request $request)
    {
        // Validar los datos recibidos del formulario
        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'autor_id' => 'required|number',
            'ubicacion_id' => 'required|number',
            'categoria_id' => 'required|number',
        ]);

        // Crear el libro con los datos validados
        Libro::create($request->only('titulo','descripcion','autor_id','ubicacion_id','categoria_id'));
        
        // Redirige hacia atrás con un mensaje de éxito
        return redirect()->back()->with('success', 'Libro creado correctamente.');
    }

    /**
    * Actualizar un libro existente.
    */
    public function update(Request $request, $id)
    {
        $libro = Libro::findOrFail($id); // Verifica que el libro exista
        
        // Validar los nuevos datos
        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'autor_id' => 'required|number',
            'ubicacion_id' => 'required|number',
            'categoria_id' => 'required|number',
            ]);
        
            // Actualizar los datos del libro
        $libro->update($request->only('titulo','descripcion','autor_id','ubicacion_id','categoria_id'));
        return redirect()->back()->with('success', 'Libro actualizado correctamente.');
    }

    /**
    * Eliminar un libro de la base de datos.
    */
    public function destroy($id)
    {
        $libro = Libro::findOrFail($id); // Asegura que el libro exista
        $libro->delete(); // Elimina el libro
        return redirect()->back()->with('success', 'Libro eliminado correctamente.');
    }
}
