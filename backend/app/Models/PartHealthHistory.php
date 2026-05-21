<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartHealthHistory extends Model
{
    protected $fillable = ['part_id', 'km_recorded', 'wear_percentage', 'recorded_at'];

    protected function casts(): array
    {
        return ['recorded_at' => 'datetime'];
    }

    public function part()
    {
        return $this->belongsTo(Part::class);
    }
}
