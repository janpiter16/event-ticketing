<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\EventCategory;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventPolicyTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RoleSeeder::class);
    }

    public function test_organizer_can_view_own_event(): void
    {
        $organizer = User::factory()->create();
        $organizer->roles()->attach(Role::where('slug', 'organizer')->first());

        $category = EventCategory::factory()->create();
        
        $event = Event::factory()->create([
            'organizer_id' => $organizer->id,
            'category_id' => $category->id,
        ]);

        $response = $this->actingAs($organizer)
            ->getJson("/api/events/{$event->id}");

        $response->assertOk();
    }

    public function test_organizer_cannot_view_another_event(): void
    {
        $organizer1 = User::factory()->create();
        $organizer1->roles()->attach(Role::where('slug', 'organizer')->first());

        $organizer2 = User::factory()->create();
        $organizer2->roles()->attach(Role::where('slug', 'organizer')->first());

        $category = EventCategory::factory()->create();
        
        $event = Event::factory()->create([
            'organizer_id' => $organizer1->id,
            'category_id' => $category->id,
        ]);

        $response = $this->actingAs($organizer2)
            ->getJson("/api/events/{$event->id}");

        $response->assertForbidden();
    }

    public function test_super_admin_can_view_any_event(): void
    {
        $organizer = User::factory()->create();
        $organizer->roles()->attach(Role::where('slug', 'organizer')->first());

        $superAdmin = User::factory()->create();
        $superAdmin->roles()->attach(Role::where('slug', 'super-admin')->first());

        $category = EventCategory::factory()->create();
        
        $event = Event::factory()->create([
            'organizer_id' => $organizer->id,
            'category_id' => $category->id,
        ]);

        $response = $this->actingAs($superAdmin)
            ->getJson("/api/events/{$event->id}");

        $response->assertOk();
    }
}
