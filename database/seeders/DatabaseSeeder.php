<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Review;
use App\Models\Schedule;
use App\Models\Service;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $users=User::factory()->count(15)->create(['role' => 'user']);
        User::factory()->freelancer()->count(15)->create();
        User::factory()->company()->count(15)->create();

        Service::factory()->forCompany()->count(10)->create();
        Service::factory()->forFreelancer()->count(10)->create();
        Schedule::factory()->count(10)->create();
        Booking::factory(10)->make()->each(function ($booking) use ($users) {
            $booking->user_id = $users->random()->id;
            $booking->save();
        });
        Review::factory(40)->make()->each(function ($review) use ($users) {
            $review->user_id = $users->random()->id;
            $review->save();
        });
    }
}
