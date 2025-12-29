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
        // Frontend Skills
        Skill::create([
            'name' => 'React',
            'category' => 'Frontend',
            'proficiency' => 95,
        ]);

        Skill::create([
            'name' => 'TypeScript',
            'category' => 'Frontend',
            'proficiency' => 93,
        ]);

        Skill::create([
            'name' => 'Next.js',
            'category' => 'Frontend',
            'proficiency' => 90,
        ]);

        Skill::create([
            'name' => 'Vue.js',
            'category' => 'Frontend',
            'proficiency' => 85,
        ]);

        Skill::create([
            'name' => 'HTML/CSS',
            'category' => 'Frontend',
            'proficiency' => 95,
        ]);

        // Backend Skills
        Skill::create([
            'name' => 'Node.js',
            'category' => 'Backend',
            'proficiency' => 94,
        ]);

        Skill::create([
            'name' => 'Python',
            'category' => 'Backend',
            'proficiency' => 92,
        ]);

        Skill::create([
            'name' => 'Go',
            'category' => 'Backend',
            'proficiency' => 88,
        ]);

        Skill::create([
            'name' => 'Laravel',
            'category' => 'Backend',
            'proficiency' => 88,
        ]);

        Skill::create([
            'name' => 'REST APIs',
            'category' => 'Backend',
            'proficiency' => 95,
        ]);

        Skill::create([
            'name' => 'GraphQL',
            'category' => 'Backend',
            'proficiency' => 90,
        ]);

        // Database Skills
        Skill::create([
            'name' => 'PostgreSQL',
            'category' => 'Database',
            'proficiency' => 92,
        ]);

        Skill::create([
            'name' => 'MongoDB',
            'category' => 'Database',
            'proficiency' => 88,
        ]);

        Skill::create([
            'name' => 'MySQL',
            'category' => 'Database',
            'proficiency' => 90,
        ]);

        // DevOps & Cloud
        Skill::create([
            'name' => 'Docker',
            'category' => 'DevOps',
            'proficiency' => 91,
        ]);

        Skill::create([
            'name' => 'Kubernetes',
            'category' => 'DevOps',
            'proficiency' => 87,
        ]);

        Skill::create([
            'name' => 'AWS',
            'category' => 'Cloud',
            'proficiency' => 89,
        ]);

        Skill::create([
            'name' => 'GCP',
            'category' => 'Cloud',
            'proficiency' => 90,
        ]);

        // Tools
        Skill::create([
            'name' => 'Git',
            'category' => 'Tools',
            'proficiency' => 95,
        ]);

        Skill::create([
            'name' => 'CI/CD',
            'category' => 'Tools',
            'proficiency' => 90,
        ]);
    }
}
