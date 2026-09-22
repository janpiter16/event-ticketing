<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EventCategory;
use Illuminate\Http\Request;

class EventCategoryController extends Controller
{
    public function index()
    {
        $categories = EventCategory::where('is_active', true)->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    public function show(EventCategory $category)
    {
        return response()->json([
            'success' => true,
            'data' => $category,
        ]);
    }
}
