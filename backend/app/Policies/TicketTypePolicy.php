<?php

namespace App\Policies;

use App\Models\TicketType;
use App\Models\User;

class TicketTypePolicy
{
    public function view(User $user, ?TicketType $ticketType): bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        if ($ticketType === null) {
            return false;
        }

        return $ticketType->event->organizer_id === $user->id;
    }

    public function create(User $user, int $eventId): bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        $event = \App\Models\Event::find($eventId);

        return $event && $event->organizer_id === $user->id;
    }

    public function update(User $user, TicketType $ticketType): bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        return $ticketType->event->organizer_id === $user->id;
    }

    public function delete(User $user, TicketType $ticketType): bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        return $ticketType->event->organizer_id === $user->id;
    }
}
