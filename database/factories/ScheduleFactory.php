<?php

namespace Database\Factories;

use App\Models\Schedule;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Schedule>
 */
class ScheduleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model=Schedule::class;
    public function definition(): array
    {
        return [
            'date' => $this->faker->date(),
            'time_from' => $this->faker->time(),
            'time_to' => $this->faker->time(),
            'service_id' =>Service::inRandomOrder()->first()->id,
            'assigned_employees'=>$this->faker->numberBetween(1,10),
        ];
    }
}
