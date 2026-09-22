<?php

namespace Database\Factories;

use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startAt = $this->faker->dateTimeBetween('+1 day', '+30 days');
        $endAt = (clone $startAt)->modify('+4 hours');
        
        return [
            'organizer_id' => \App\Models\User::factory(),
            'category_id' => \App\Models\EventCategory::factory(),
            'name' => $this->faker->sentence(),
            'slug' => $this->faker->unique()->slug(),
            'description' => $this->faker->paragraph(),
            'start_at' => $startAt,
            'end_at' => $endAt,
            'status' => 'PUBLISHED',
        ];
    }
}
