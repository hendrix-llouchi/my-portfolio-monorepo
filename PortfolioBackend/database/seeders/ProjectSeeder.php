<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Project::create([
            'title' => 'EducAid AI Quiz Generator',
            'description' => 'An AI-powered tool to generate quizzes for students.',
            'tech_stack' => ['Python', 'OpenAI API', 'Streamlit'],
            'image_url' => null,
            'demo_link' => null,
            'repo_link' => null,
        ]);

        Project::create([
            'title' => 'Customer Churn Prediction',
            'description' => 'ML model to predict customer drop-off rates.',
            'tech_stack' => ['Python', 'Scikit-Learn', 'Pandas'],
            'image_url' => null,
            'demo_link' => null,
            'repo_link' => null,
        ]);

        Project::create([
            'title' => 'Portfolio Site',
            'description' => 'My personal portfolio.',
            'tech_stack' => ['React', 'Laravel', 'Tailwind'],
            'image_url' => null,
            'demo_link' => null,
            'repo_link' => null,
        ]);
    }
}
