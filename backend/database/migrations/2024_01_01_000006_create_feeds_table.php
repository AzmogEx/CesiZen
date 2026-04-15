<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feeds', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->string('slug')->unique();
            $table->longText('contenu');
            $table->string('image_url')->nullable();
            $table->boolean('est_publie')->default(false);
            $table->foreignId('auteur_id')->constrained('utilisateurs')->onDelete('cascade');
            $table->integer('ordre')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feeds');
    }
};
