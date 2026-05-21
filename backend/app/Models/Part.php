<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Part extends Model
{
    protected $fillable = ['bike_id', 'name', 'lifespan_km', 'last_changed_km', 'current_km'];

    public function bike()
    {
        return $this->belongsTo(Bike::class);
    }

    public function histories()
    {
        return $this->hasMany(PartHealthHistory::class);
    }

    public function getWearPercentageAttribute(): int
    {
        $km = $this->current_km - $this->last_changed_km;
        return min(100, (int) round(($km / $this->lifespan_km) * 100));
    }

    public function getRemainingKmAttribute(): int
    {
        $used = $this->current_km - $this->last_changed_km;
        return max(0, $this->lifespan_km - $used);
    }
}
