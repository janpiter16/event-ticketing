<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Super Admin',
                'slug' => 'super-admin',
                'description' => 'Full platform access and management',
            ],
            [
                'name' => 'Organizer',
                'slug' => 'organizer',
                'description' => 'Create and manage events',
            ],
            [
                'name' => 'Staff',
                'slug' => 'staff',
                'description' => 'Check-in and event operations',
            ],
            [
                'name' => 'Participant',
                'slug' => 'participant',
                'description' => 'Register and attend events',
            ],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['slug' => $role['slug']], $role);
        }
    }
}
