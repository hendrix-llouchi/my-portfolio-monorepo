<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed admin user first
        $this->call(AdminSeeder::class);

        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Seed profile
        $this->call(ProfileSeeder::class);

        // Seed projects
        $this->call(ProjectSeeder::class);

        // Seed skills
        $this->call(SkillSeeder::class);

        // Seed experiences
        $this->call(ExperienceSeeder::class);
    }
}
