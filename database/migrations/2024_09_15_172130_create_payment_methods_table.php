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
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->foreignId('payment_method_id')->constrained(); // Référence à la méthode de paiement
            $table->string('transaction_reference')->nullable();   // Par exemple, pour Mobile Money
            $table->string('phone_number')->nullable();            // Mobile Money
            $table->string('cheque_number')->nullable();           // Pour les chèques
            $table->string('signatory_name')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_methods');
    }
};
