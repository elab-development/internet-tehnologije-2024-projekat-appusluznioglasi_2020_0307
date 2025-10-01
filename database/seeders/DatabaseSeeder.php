<?php

namespace Database\Seeders;

use App\Models\Booking;
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

        User::factory()->count(10)->create();

        Service::factory()->forCompany()->count(10)->create();
        Service::factory()->forFreelancer()->count(10)->create();
        Schedule::factory()->count(10)->create();
        Booking::factory()->count(40)->create();
    }
}
