<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('saisie_trackers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tracker_id')->constrained('trackers')->onDelete('cascade');
            $table->foreignId('emotion_id')->constrained('emotions');
            $table->tinyInteger('intensite');
            $table->text('note')->nullable();
            $table->dateTime('date_saisie');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('saisie_trackers');
    }
};
