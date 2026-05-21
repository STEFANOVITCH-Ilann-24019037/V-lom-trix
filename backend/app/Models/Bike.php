<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bike extends Model
{
    protected $fillable = ['user_id', 'name', 'type', 'initial_km', 'current_km'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function parts()
    {
        return $this->hasMany(Part::class);
    }
}
