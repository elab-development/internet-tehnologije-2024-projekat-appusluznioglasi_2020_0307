<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model=Booking::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'schedule_id'=>Schedule::factory(),
            'status'=>$this->faker->randomElement(['pending','confirmed','done','canceled']),
        ];
    }
}
