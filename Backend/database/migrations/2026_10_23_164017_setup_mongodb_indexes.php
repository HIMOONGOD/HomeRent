<?php

use Illuminate\Database\Migrations\Migration;
use MongoDB\Laravel\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::connection('mongodb')->table('users', function (Blueprint $collection) {
            $collection->uniqid('email');
            $collection->index('username');
            $collection->index('role');
            $collection->index('status');
            $collection->index('point');
        });

        Schema::create('properties', function (Blueprint $collection) {

            $collection->index('ownerId');

            $collection->index('purpose');

            $collection->index('status');

            $collection->index('location.city');

            $collection->index('leaseType');

            $collection->index('expiresAt');
        });

        Schema::create('creditTransactions', function (Blueprint $collection) {

            $collection->index('userId');


            $collection->index('propertyId');

            $collection->unique('idempotencyKey');

            $collection->index('createdAt');

            $collection->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('properties');
    }
};
