<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Skill::create([
            'name' => 'React',
            'category' => 'Frontend',
            'proficiency' => 85,
        ]);

        Skill::create([
            'name' => 'Laravel',
            'category' => 'Backend',
            'proficiency' => 88,
        ]);

        Skill::create([
            'name' => 'TypeScript',
            'category' => 'Frontend',
            'proficiency' => 80,
        ]);

        Skill::create([
            'name' => 'Python',
            'category' => 'Backend',
            'proficiency' => 92,
        ]);

        Skill::create([
            'name' => 'Git',
            'category' => 'Tools',
            'proficiency' => 90,
        ]);

        Skill::create([
            'name' => 'MySQL',
            'category' => 'Backend',
            'proficiency' => 85,
        ]);
    }
}
