<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => 'nullable|exists:event_categories,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'cover_image' => 'nullable|string|max:255',
            'start_at' => 'required|date|after:now',
            'end_at' => 'required|date|after:start_at',
            'registration_open_at' => 'nullable|date',
            'registration_close_at' => 'nullable|date|before:start_at',
            'venue_name' => 'nullable|string|max:255',
            'venue_address' => 'nullable|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'is_online' => 'boolean',
            'online_url' => 'nullable|string|max:500',
            'terms_and_conditions' => 'nullable|string',
        ];
    }
}
