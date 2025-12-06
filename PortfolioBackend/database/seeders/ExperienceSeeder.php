<?php

namespace Database\Seeders;

use App\Models\Experience;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExperienceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Experience::create([
            'company' => 'Npontu Technologies Limited',
            'role' => 'Full-Stack Developer Intern',
            'period' => 'Nov 2025 - Present',
            'description' => 'Learning Laravel & Vue.js. Developing and maintaining web applications, ensuring scalable architecture and responsive design.',
            'technologies' => ['Laravel', 'Vue.js', 'MySQL', 'Git'],
        ]);

        Experience::create([
            'company' => 'Computer Engineering',
            'role' => 'Student',
            'period' => '2020 - Present',
            'description' => 'Academic coursework in software engineering, data structures, algorithms, and system design.',
            'technologies' => ['Python', 'Java', 'C++', 'Data Structures', 'Algorithms'],
        ]);

        Experience::create([
            'company' => 'Rotary Club Ghana',
            'role' => 'Mobile App Developer',
            'period' => '2024 - 2025',
            'description' => 'Developed a mobile application for Rotary Club Ghana to streamline member management and event coordination.',
            'technologies' => ['React Native', 'Node.js', 'MongoDB', 'Firebase'],
        ]);
    }
}
