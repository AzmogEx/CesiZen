<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contacts_urgence', function (Blueprint $table) {
            $table->id();
            $table->foreignId('utilisateur_id')->constrained('utilisateurs')->onDelete('cascade');
            $table->string('nom');
            $table->string('telephone');
            $table->string('relation');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contacts_urgence');
    }
};
