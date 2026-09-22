<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Event extends Model
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'organizer_id',
        'category_id',
        'name',
        'slug',
        'description',
        'cover_image',
        'start_at',
        'end_at',
        'registration_open_at',
        'registration_close_at',
        'venue_name',
        'venue_address',
        'latitude',
        'longitude',
        'is_online',
        'online_url',
        'terms_and_conditions',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
        'start_at' => 'datetime',
        'end_at' => 'datetime',
        'registration_open_at' => 'datetime',
        'registration_close_at' => 'datetime',
        'is_online' => 'boolean',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function category()
    {
        return $this->belongsTo(EventCategory::class, 'category_id');
    }

    public function ticketTypes()
    {
        return $this->hasMany(TicketType::class);
    }

    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }

    public function staff()
    {
        return $this->hasMany(EventStaff::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'PUBLISHED');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_at', '>=', now());
    }
}
