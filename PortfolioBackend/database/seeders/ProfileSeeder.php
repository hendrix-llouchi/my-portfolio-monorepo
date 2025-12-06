<?php

namespace Database\Seeders;

use App\Models\Profile;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Profile::updateOrCreate(
            ['id' => 1],
            [
                'name' => 'Henry Cobbinah',
                'headline' => 'Software Engineer | Full-Stack & Mobile Dev',
                'sub_headline' => 'Machine Learning • Data Science • AI',
                'short_bio' => 'Building scalable apps and intelligent solutions.',
                'status_text' => 'System Online',
                'avatar_url' => null,
                'resume_url' => null,
                'linkedin' => null,
                'github' => null,
            ]
        );
    }
}
