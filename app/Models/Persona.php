<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    use HasFactory;

    protected $fillable = ['codigo','nombre'];

    public function prestamo_libros()
    {
        return $this->hasMany(PrestamoLibro::class);
    }
}
