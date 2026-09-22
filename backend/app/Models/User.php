<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles');
    }

    public function organizerProfile()
    {
        return $this->hasOne(OrganizerProfile::class);
    }

    public function eventStaff()
    {
        return $this->hasMany(EventStaff::class);
    }

    public function hasRole($roleSlug)
    {
        return $this->roles()->where('slug', $roleSlug)->exists();
    }

    public function hasAnyRole(array $roleSlugs)
    {
        return $this->roles()->whereIn('slug', $roleSlugs)->exists();
    }

    public function isSuperAdmin()
    {
        return $this->hasRole('super-admin');
    }

    public function isOrganizer()
    {
        return $this->hasRole('organizer');
    }

    public function isStaff()
    {
        return $this->hasRole('staff');
    }

    public function isParticipant()
    {
        return $this->hasRole('participant');
    }
}
