<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\EventCategory;
use App\Models\OrganizerProfile;
use App\Models\Role;
use App\Models\TicketType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $organizerRole = Role::where('slug', 'organizer')->first();
        $participantRole = Role::where('slug', 'participant')->first();
        $staffRole = Role::where('slug', 'staff')->first();

        // 1. Create Demo Organizer
        $organizer = User::firstOrCreate(
            ['email' => 'organizer@eventflow.id'],
            [
                'name' => 'TechVerse Events',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );
        if ($organizerRole && !$organizer->roles()->where('slug', 'organizer')->exists()) {
            $organizer->roles()->attach($organizerRole);
        }

        OrganizerProfile::firstOrCreate(
            ['user_id' => $organizer->id],
            [
                'organization_name' => 'TechVerse Indonesia',
                'organization_description' => 'Komunitas inovasi teknologi dan konferensi developer terdepan di Indonesia.',
                'website' => 'https://techverse.id',
                'is_verified' => true,
            ]
        );

        // 2. Create Demo Participant
        $participant = User::firstOrCreate(
            ['email' => 'participant@eventflow.id'],
            [
                'name' => 'Ahmad Fauzi',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );
        if ($participantRole && !$participant->roles()->where('slug', 'participant')->exists()) {
            $participant->roles()->attach($participantRole);
        }

        // Get Categories
        $techCat = EventCategory::where('slug', 'technology-it')->first();
        $bizCat = EventCategory::where('slug', 'business-entrepreneurship')->first();
        $workshopCat = EventCategory::where('slug', 'workshops-seminars')->first();

        // 3. Create Sample Events
        $eventsData = [
            [
                'name' => 'AI & Cloud Summit Indonesia 2026',
                'slug' => 'ai-and-cloud-summit-indonesia-2026',
                'description' => 'Konferensi tahunan terbesar di Jakarta yang membahas masa depan Artificial Intelligence, Cloud Infrastructure, dan skalabilitas sistem berskala tinggi bersama para CTO dan Tech Lead terkemuka.',
                'category_id' => $techCat?->id,
                'organizer_id' => $organizer->id,
                'cover_image' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
                'start_at' => now()->addDays(14)->setTime(9, 0),
                'end_at' => now()->addDays(14)->setTime(17, 0),
                'venue_name' => 'Grand Ballroom Pullman Central Park',
                'venue_address' => 'Jl. Letjen S. Parman No. Kav 28, Jakarta Barat',
                'is_online' => false,
                'status' => 'PUBLISHED',
                'tickets' => [
                    [
                        'name' => 'Early Bird Access',
                        'code' => 'EB-AICLOUD',
                        'description' => 'Akses penuh ke semua sesi keynote & workshop tracks. Termasuk lunch box & merchandise.',
                        'price' => 150000,
                        'quota' => 50,
                    ],
                    [
                        'name' => 'General Attendee',
                        'code' => 'REG-AICLOUD',
                        'description' => 'Akses regular konferensi, networking lounge, dan sertifikat partisipasi.',
                        'price' => 250000,
                        'quota' => 150,
                    ],
                    [
                        'name' => 'VIP Executive Pass',
                        'code' => 'VIP-AICLOUD',
                        'description' => 'Akses front-row seat, exclusive VIP dinner bersama speakers, dan fast-track check-in.',
                        'price' => 750000,
                        'quota' => 20,
                    ]
                ]
            ],
            [
                'name' => 'Mastering Modern UI/UX: Design System & Micro-interactions',
                'slug' => 'mastering-modern-ui-ux-design-system',
                'description' => 'Workshop intensif daring 2 hari untuk Product Designer & Frontend Developer yang ingin membangun Design System kelas dunia dengan prinsip editorial yang bersih dan fungsional.',
                'category_id' => $workshopCat?->id,
                'organizer_id' => $organizer->id,
                'cover_image' => 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80',
                'start_at' => now()->addDays(7)->setTime(13, 0),
                'end_at' => now()->addDays(8)->setTime(16, 30),
                'is_online' => true,
                'online_url' => 'https://zoom.us/j/eventflow-design-system',
                'status' => 'PUBLISHED',
                'tickets' => [
                    [
                        'name' => 'Free Community Pass',
                        'code' => 'FREE-UIUX',
                        'description' => 'Akses live stream sesi umum hari pertama.',
                        'price' => 0,
                        'quota' => 200,
                    ],
                    [
                        'name' => 'Full Workshop + Figma Files',
                        'code' => 'PRO-UIUX',
                        'description' => 'Akses 2 hari penuh, review portofolio interaktif, dan source code template.',
                        'price' => 99000,
                        'quota' => 80,
                    ]
                ]
            ],
            [
                'name' => 'Startup Pitch & Founder Networking Night',
                'slug' => 'startup-pitch-founder-networking-night',
                'description' => 'Malam kurasi pitch deck di hadapan 10+ Angel Investors dan Venture Capital ternama di Asia Tenggara. Kesempatan terbaik untuk scale-up ide bisnismu.',
                'category_id' => $bizCat?->id,
                'organizer_id' => $organizer->id,
                'cover_image' => 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=80',
                'start_at' => now()->addDays(21)->setTime(18, 30),
                'end_at' => now()->addDays(21)->setTime(22, 0),
                'venue_name' => 'Block71 Jakarta Innovation Hub',
                'venue_address' => 'Ariobimo Sentral lt. 8, Kuningan Timur, Jakarta Selatan',
                'is_online' => false,
                'status' => 'PUBLISHED',
                'tickets' => [
                    [
                        'name' => 'General Networking Pass',
                        'code' => 'PITCH-REG',
                        'description' => 'Akses audience networking dan sesi panel tanya jawab.',
                        'price' => 75000,
                        'quota' => 100,
                    ]
                ]
            ]
        ];

        foreach ($eventsData as $eData) {
            $tickets = $eData['tickets'];
            unset($eData['tickets']);

            $event = Event::updateOrCreate(
                ['slug' => $eData['slug']],
                $eData
            );

            foreach ($tickets as $tData) {
                TicketType::updateOrCreate(
                    [
                        'event_id' => $event->id,
                        'name' => $tData['name'],
                    ],
                    array_merge($tData, [
                        'event_id' => $event->id,
                        'min_purchase' => 1,
                        'max_purchase' => 5,
                        'is_active' => true,
                    ])
                );
            }
        }
    }
}
