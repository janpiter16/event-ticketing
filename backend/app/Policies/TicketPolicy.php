<?php

namespace App\Policies;

use App\Models\Ticket;
use App\Models\User;

class TicketPolicy
{
    public function view(User $user, Ticket $ticket): bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        if ($ticket->user_id === $user->id) {
            return true;
        }

        if ($ticket->registration->ticketType->event->organizer_id === $user->id) {
            return true;
        }

        return $user->eventStaff()
            ->where('event_id', $ticket->registration->ticketType->event->id)
            ->exists();
    }

    public function update(User $user, Ticket $ticket): bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        if ($ticket->user_id === $user->id) {
            return true;
        }

        return $ticket->registration->ticketType->event->organizer_id === $user->id;
    }
}
