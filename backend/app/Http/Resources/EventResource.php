<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'organizer_id' => $this->organizer_id,
            'category_id' => $this->category_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'cover_image' => $this->cover_image,
            'start_at' => $this->start_at,
            'end_at' => $this->end_at,
            'registration_open_at' => $this->registration_open_at,
            'registration_close_at' => $this->registration_close_at,
            'venue_name' => $this->venue_name,
            'venue_address' => $this->venue_address,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'is_online' => $this->is_online,
            'online_url' => $this->online_url,
            'terms_and_conditions' => $this->terms_and_conditions,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'organizer' => $this->whenLoaded('organizer', fn() => [
                'id' => $this->organizer->id,
                'name' => $this->organizer->name,
                'email' => $this->organizer->email,
            ]),
            'category' => new EventCategoryResource($this->whenLoaded('category')),
            'ticket_types' => $this->whenLoaded('ticketTypes'),
        ];
    }
}
