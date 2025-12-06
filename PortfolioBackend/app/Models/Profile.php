<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'name',
        'headline',
        'sub_headline',
        'short_bio',
        'avatar_url',
        'resume_url',
        'linkedin',
        'github',
        'status_text',
    ];
}
