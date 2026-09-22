<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketType extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'name',
        'code',
        'description',
        'price',
        'quota',
        'sale_start_at',
        'sale_end_at',
        'min_purchase',
        'max_purchase',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'quota' => 'integer',
        'min_purchase' => 'integer',
        'max_purchase' => 'integer',
        'is_active' => 'boolean',
        'sale_start_at' => 'datetime',
        'sale_end_at' => 'datetime',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
