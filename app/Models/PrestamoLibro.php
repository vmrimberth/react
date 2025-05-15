<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrestamoLibro extends Model
{
    use HasFactory;

    protected $fillable = ['libro_id','persona_id'];

    public function libro()
    {
        return $this->belongsTo(Libro::class, 'libro_id'); //Asegúrate de especificar el campo
    }

    public function persona()
    {
        return $this->belongsTo(Persona::class, 'persona_id'); //Asegúrate de especificar el campo
    }

}
