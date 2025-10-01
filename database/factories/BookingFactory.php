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
            static $freeSchedules;

        if ($freeSchedules === null) {
            $freeSchedules = Schedule::pluck('id')->toArray();
        }

        if (empty($freeSchedules)) {
            throw new \Exception("Nema više slobodnih schedule-ova.");
        }

        $scheduleId = array_pop($freeSchedules);
        return [
            'user_id' => User::inRandomOrder()->first()->id,
            'schedule_id' => $scheduleId,
            'status'=>$this->faker->randomElement(['pending','confirmed','done','canceled']),
        ];
    }
}
