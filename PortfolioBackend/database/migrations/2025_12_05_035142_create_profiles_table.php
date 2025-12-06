<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('headline');
            $table->string('sub_headline')->nullable();
            $table->text('short_bio')->nullable();
            $table->string('avatar_url')->nullable();
            $table->string('resume_url')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('github')->nullable();
            $table->string('status_text')->default('System Online');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
