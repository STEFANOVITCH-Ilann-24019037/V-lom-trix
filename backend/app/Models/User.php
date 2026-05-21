<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['name', 'email', 'password', 'strava_connected'];
    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'strava_connected' => 'boolean',
        ];
    }

    public function stravaToken()
    {
        return $this->hasOne(StravaToken::class);
    }

    public function bikes()
    {
        return $this->hasMany(Bike::class);
    }

    public function mobileDevices()
    {
        return $this->hasMany(MobileDevice::class);
    }
}
