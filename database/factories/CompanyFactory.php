<?php

namespace Database\Factories;
use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Company>
 */
class CompanyFactory extends Factory
{
protected $model = Company::class;


    public function definition(): array
    {
        $minLat = 42.0;
        $maxLat = 46.0;
        $minLon = 18.0;
        $maxLon = 23.0;
        return [
            'name' => $this->faker->company,
            'description' => $this->faker->sentence(10),
            'badge_verified' => $this->faker->boolean,
            'address' => $this->faker->streetAddress . ', ' . $this->faker->city,
            'latitude' => $this->faker->randomFloat(7, $minLat, $maxLat),
            'longitude' => $this->faker->randomFloat(7, $minLon, $maxLon),
            // user_id se postavlja iz UserFactory posle kreiranja
        ];
    }
}
