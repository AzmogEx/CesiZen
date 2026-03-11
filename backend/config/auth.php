<?php

use App\Models\Utilisateur;

return [

    'defaults' => [
        'guard' => 'api',
        'passwords' => 'utilisateurs',
    ],

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'utilisateurs',
        ],
        'api' => [
            'driver' => 'jwt',
            'provider' => 'utilisateurs',
        ],
    ],

    'providers' => [
        'utilisateurs' => [
            'driver' => 'eloquent',
            'model' => Utilisateur::class,
        ],
    ],

    'passwords' => [
        'utilisateurs' => [
            'provider' => 'utilisateurs',
            'table' => 'password_reset_tokens',
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    'password_timeout' => env('AUTH_PASSWORD_TIMEOUT', 10800),

];
