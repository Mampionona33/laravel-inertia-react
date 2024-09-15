<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            // Clé étrangère vers la table reservations, suppression en cascade
            $table->foreignId('reservation_id')
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade');

            // Clé étrangère vers la table payment_methods, suppression en cascade
            $table->foreignId('payment_method_id')
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade');

            // Détails spécifiques aux méthodes de paiement
            $table->string('transaction_reference')->nullable(); // Pour Mobile Money
            $table->string('phone_number')->nullable();           // Pour Mobile Money
            $table->string('cheque_number')->nullable();          // Pour les chèques
            $table->string('signatory_name')->nullable();         // Pour les chèques
            $table->string('reference')->nullable();              // Référence du paiement
            $table->string('description')->nullable();            // Description du paiement
            $table->string('receipt')->nullable();                // Preuve de paiement, ex: URL du reçu

            // Montant du paiement
            $table->decimal('amount', 10, 2);

            // Dates de paiement et échéance
            $table->timestamp('paid_at')->nullable(); // Date du paiement
            $table->timestamp('due_date');            // Date limite de paiement

            // Statut du paiement
            $table->enum('status', ["pending", "paid", "cancelled"])
                ->default("pending");

            // Horodatage (created_at et updated_at)
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
        Schema::dropIfExists('payments');
    }
}
