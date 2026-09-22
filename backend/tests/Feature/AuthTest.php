<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RoleSeeder::class);
    }

    public function test_registration_creates_user_with_role(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'John Organizer',
            'email' => 'organizer@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'organizer',
        ]);

        $response->assertStatus(201);
        $this->assertNotEmpty($response->json('data.token'));
        
        $user = User::where('email', 'organizer@test.com')->first();
        $this->assertNotNull($user);
        $this->assertTrue($user->hasRole('organizer'));
    }

    public function test_login_returns_token(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123'),
        ]);
        $user->roles()->attach(Role::where('slug', 'participant')->first());

        $response = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(200);
        $this->assertNotEmpty($response->json('data.token'));
    }

    public function test_login_fails_with_wrong_password(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(422);
    }

    public function test_me_requires_authentication(): void
    {
        $response = $this->getJson('/api/auth/me');

        $response->assertStatus(401);
    }

    public function test_logout_invalidates_token(): void
    {
        $user = User::factory()->create();
        $user->roles()->attach(Role::where('slug', 'participant')->first());
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/auth/logout');

        $response->assertStatus(200);
        
        $freshUser = User::find($user->id);
        $this->assertCount(0, $freshUser->tokens);
    }

    public function test_profile_returns_authenticated_user(): void
    {
        $user = User::factory()->create();
        $user->roles()->attach(Role::where('slug', 'participant')->first());

        $response = $this->actingAs($user)
            ->getJson('/api/auth/me');

        $response->assertStatus(200);
        $response->assertJsonPath('data.id', $user->id);
        $response->assertJsonPath('data.email', $user->email);
    }

    public function test_organizer_can_register_with_organizer_role(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Jane Organizer',
            'email' => 'jane@organizer.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'organizer',
        ]);

        $response->assertStatus(201);
        $user = User::where('email', 'jane@organizer.com')->first();
        $this->assertTrue($user->isOrganizer());
    }

    public function test_participant_default_role(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Default Participant',
            'email' => 'participant@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201);
        $user = User::where('email', 'participant@test.com')->first();
        $this->assertTrue($user->isParticipant());
    }
}
