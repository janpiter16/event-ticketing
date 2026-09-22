<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

class EventPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Event $event): bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        return $event->organizer_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['super-admin', 'organizer']);
    }

    public function update(User $user, Event $event): bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        return $event->organizer_id === $user->id;
    }

    public function delete(User $user, Event $event): bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        return $event->organizer_id === $user->id;
    }

    public function publish(User $user, Event $event): bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        return $event->organizer_id === $user->id;
    }

    public function unpublish(User $user, Event $event): bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        return $event->organizer_id === $user->id;
    }

    public function cancel(User $user, Event $event): bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        return $event->organizer_id === $user->id;
    }

    public function archive(User $user, Event $event): bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        return $event->organizer_id === $user->id;
    }

    public function manageStaff(User $user, Event $event): bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        return $event->organizer_id === $user->id;
    }
}
