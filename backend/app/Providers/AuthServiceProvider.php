<?php

namespace App\Providers;

use App\Models\Event;
use App\Models\Ticket;
use App\Models\TicketType;
use App\Policies\EventPolicy;
use App\Policies\TicketPolicy;
use App\Policies\TicketTypePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Event::class => EventPolicy::class,
        TicketType::class => TicketTypePolicy::class,
        Ticket::class => TicketPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
