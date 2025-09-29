<?php

namespace Database\Factories;

use App\Models\User; 
use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        $role = $this->faker->randomElement(['user','freelancer','company']);

        return [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => Hash::make('lozinka123'),
            'role' => $role,
            'remember_token' => Str::random(10),
        ];
    }

    public function company(): static
    {
        return $this->state(fn (array $attributes) => ['role' => 'company']);
    }

    public function freelancer(): static
    {
        return $this->state(fn (array $attributes) => ['role' => 'freelancer']);
    }

    public function configure(): static
    {
        return $this->afterCreating(function (User $user) {
            if ($user->role === 'company') {
                Company::factory()->create([
                    'user_id' => $user->id,
                ]);
            }
        });
    }
    //Company::factory()->create
}
