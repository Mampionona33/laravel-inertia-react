<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReservationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('ref')->unique();
            $table->string('nom_client');
            $table->string('num_tel');
            $table->date('date_debut');
            $table->date('date_fin');
            $table->integer('repas')->nullable();
            $table->integer('nb_participants')->nullable();
            $table->string('remarques')->nullable();
            $table->foreignId('salle_id')->constrained()->onDelete('cascade');
            $table->string('payment_method');
            $table->string('activites')->nullable();
            $table->decimal('total_amount', 8, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reservations');
    }
}
