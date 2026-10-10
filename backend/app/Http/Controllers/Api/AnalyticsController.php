<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\IssuedTicket;
use App\Models\Order;

class AnalyticsController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();

        // Only organizers should see their own analytics
        $eventIds = Event::where('organizer_id', $user->id)->pluck('id');

        $totalEvents = $eventIds->count();
        $publishedEvents = Event::where('organizer_id', $user->id)->where('status', 'PUBLISHED')->count();
        $draftEvents = Event::where('organizer_id', $user->id)->where('status', 'DRAFT')->count();

        $totalParticipants = IssuedTicket::whereIn('event_id', $eventIds)->count();

        $totalRevenue = Order::whereIn('event_id', $eventIds)->where('status', 'PAID')->sum('total_amount');

        return response()->json([
            'data' => [
                'total_events' => $totalEvents,
                'published_events' => $publishedEvents,
                'draft_events' => $draftEvents,
                'total_participants' => $totalParticipants,
                'total_revenue' => $totalRevenue,
            ]
        ]);
    }
}
