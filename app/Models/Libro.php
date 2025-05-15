<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Libro extends Model
{
    use HasFactory;
    
    protected $fillable = ['titulo','autor_id','ubicacion_id','categoria_id'];

    public function prestamo_libros()
    {
        return $this->hasMany(PrestamoLibro::class);
    }

    public function autor()
    {
        return $this->belongsTo(Autor::class, 'autor_id'); 
    }

    public function ubicacion()
    {
        return $this->belongsTo(Ubicacion::class, 'ubicacion_id'); 
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'categoria_id'); 
    }
}
