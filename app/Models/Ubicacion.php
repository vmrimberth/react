<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ubicacion extends Model
{
    use HasFactory;

    protected $fillable = ['estante','fila','columna'];

    public function libros()
    {
        return $this->hasMany(Libro::class);
    }
}
