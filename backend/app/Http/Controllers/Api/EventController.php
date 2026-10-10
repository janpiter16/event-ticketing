<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EventRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class EventController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('public')) {
            return $this->publicIndex($request);
        }

        Gate::authorize('viewAny', Event::class);

        $query = Event::with(['category', 'organizer'])->withCount('issuedTickets');

        if ($request->user()->hasRole('organizer')) {
            $query->where('organizer_id', $request->user()->id);
        }

        $events = $query->paginate(15);

        return EventResource::collection($events);
    }

    public function publicIndex(Request $request)
    {
        $query = Event::published()
            ->with(['category', 'organizer', 'ticketTypes']);

        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('is_online')) {
            $query->where('is_online', $request->boolean('is_online'));
        }

        if ($request->filled('from')) {
            $query->where('start_at', '>=', $request->from);
        }

        if ($request->filled('to')) {
            $query->where('start_at', '<=', $request->to);
        }

        $events = $query->orderBy('start_at', 'asc')->paginate(15);

        return EventResource::collection($events);
    }

    public function store(EventRequest $request)
    {
        Gate::authorize('create', Event::class);

        $validated = $request->validated();

        $event = Event::create(array_merge($validated, [
            'organizer_id' => $request->user()->id,
            'slug' => Str::slug($validated['name']),
            'status' => 'DRAFT',
        ]));

        return new EventResource($event->load(['category', 'organizer']));
    }

    public function show(Event $event)
    {
        Gate::authorize('view', $event);

        return new EventResource($event->load(['category', 'organizer', 'ticketTypes']));
    }

    public function publicShow($id)
    {
        $event = Event::published()
            ->with(['category', 'organizer', 'ticketTypes'])
            ->where(function ($query) use ($id) {
                if (is_numeric($id)) {
                    $query->where('id', (int) $id)->orWhere('slug', $id);
                } else {
                    $query->where('slug', $id);
                }
            })
            ->firstOrFail();

        return new EventResource($event);
    }

    public function update(EventRequest $request, Event $event)
    {
        Gate::authorize('update', $event);

        $validated = $request->validated();

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $event->update($validated);

        return new EventResource($event->load(['category', 'organizer']));
    }

    public function destroy(Event $event)
    {
        Gate::authorize('delete', $event);

        $event->delete();

        return response()->json([
            'success' => true,
            'message' => 'Event deleted successfully',
        ]);
    }

    public function publish(Event $event)
    {
        Gate::authorize('publish', $event);

        if ($event->status !== 'DRAFT') {
            return response()->json([
                'success' => false,
                'message' => 'Only draft events can be published',
            ], 422);
        }

        if (!$this->canPublish($event)) {
            return response()->json([
                'success' => false,
                'message' => 'Event missing required fields: name, description, start_at, end_at, and at least one ticket type',
            ], 422);
        }

        $event->update(['status' => 'PUBLISHED']);

        return new EventResource($event->load(['category', 'organizer']));
    }

    public function unpublish(Event $event)
    {
        Gate::authorize('unpublish', $event);

        if ($event->status !== 'PUBLISHED') {
            return response()->json([
                'success' => false,
                'message' => 'Only published events can be unpublished',
            ], 422);
        }

        $event->update(['status' => 'DRAFT']);

        return new EventResource($event->load(['category', 'organizer']));
    }

    public function cancel(Event $event)
    {
        Gate::authorize('cancel', $event);

        if (in_array($event->status, ['CANCELLED', 'ARCHIVED'])) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot cancel an already cancelled or archived event',
            ], 422);
        }

        $event->update(['status' => 'CANCELLED']);

        return new EventResource($event->load(['category', 'organizer']));
    }

    public function archive(Event $event)
    {
        Gate::authorize('archive', $event);

        $event->update(['status' => 'ARCHIVED']);

        return new EventResource($event->load(['category', 'organizer']));
    }

    private function canPublish(Event $event): bool
    {
        return $event->name
            && $event->description
            && $event->start_at
            && $event->end_at
            && $event->ticketTypes()->count() > 0;
    }

    public function exportAttendees(Request $request, Event $event)
    {
        // Must be the organizer or admin
        if ($event->organizer_id !== $request->user()->id && !$request->user()->hasRole('super-admin')) {
            abort(403, 'Unauthorized action.');
        }

        $tickets = \App\Models\IssuedTicket::with('ticketType')
            ->where('event_id', $event->id)
            ->get();

        $csvFileName = 'attendees_' . $event->slug . '_' . date('Ymd_His') . '.csv';
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$csvFileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function () use ($tickets) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Ticket Number', 'Participant Name', 'Participant Email', 'Ticket Type', 'Status', 'Checked In At']);

            foreach ($tickets as $ticket) {
                fputcsv($file, [
                    $ticket->ticket_number,
                    $ticket->participant_name,
                    $ticket->participant_email,
                    $ticket->ticketType->name ?? 'N/A',
                    $ticket->status,
                    $ticket->checked_in_at ? \Carbon\Carbon::parse($ticket->checked_in_at)->format('Y-m-d H:i:s') : 'Not Checked In'
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
