<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('emotions', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('couleur', 7);
            $table->string('icone')->nullable();
            $table->tinyInteger('niveau');
            $table->foreignId('parent_id')->nullable()->constrained('emotions');
            $table->boolean('est_actif')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('emotions');
    }
};
