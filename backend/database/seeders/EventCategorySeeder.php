<?php

namespace Database\Seeders;

use App\Models\EventCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EventCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Technology & IT',
                'description' => 'Events about tech, software, AI, and cybersecurity',
                'icon' => 'laptop',
                'is_active' => true,
            ],
            [
                'name' => 'Business & Entrepreneurship',
                'description' => 'Networking, startup, pitching, and business growth',
                'icon' => 'briefcase',
                'is_active' => true,
            ],
            [
                'name' => 'Workshops & Seminars',
                'description' => 'Hands-on learning, masterclasses, and skill building',
                'icon' => 'graduation-cap',
                'is_active' => true,
            ],
            [
                'name' => 'Music & Arts',
                'description' => 'Concerts, art exhibitions, and performances',
                'icon' => 'music',
                'is_active' => true,
            ],
            [
                'name' => 'Health & Wellness',
                'description' => 'Fitness, mental health, yoga, and meditation',
                'icon' => 'heart',
                'is_active' => true,
            ],
            [
                'name' => 'Community & Social',
                'description' => 'Volunteering, community meetups, and local events',
                'icon' => 'users',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $cat) {
            EventCategory::firstOrCreate(
                ['slug' => Str::slug($cat['name'])],
                array_merge($cat, ['slug' => Str::slug($cat['name'])])
            );
        }
    }
}
