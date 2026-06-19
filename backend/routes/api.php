<?php

use App\Http\Controllers\Admin\AdminEmotionController;
use App\Http\Controllers\Admin\AdminFeedController;
use App\Http\Controllers\Admin\AdminUtilisateurController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmotionController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\ProfilController;
use App\Http\Controllers\SaisieTrackerController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — CESIZen v1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // ── Auth (public) ──────────────────────────────────────
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register'])
            ->middleware('throttle:10,1');
        Route::post('login', [AuthController::class, 'login'])
            ->middleware('throttle:5,1');

        Route::middleware('jwt.auth')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('me', [AuthController::class, 'me']);
            Route::post('refresh', [AuthController::class, 'refresh']);
        });
    });

    // ── Feeds / Informations (public) ──────────────────────
    Route::get('feeds', [FeedController::class, 'index']);
    Route::get('feeds/{slug}', [FeedController::class, 'show']);

    // ── Routes authentifiées (membre) ──────────────────────
    Route::middleware('jwt.auth')->group(function () {

        // Profil
        Route::get('profil', [ProfilController::class, 'show']);
        Route::put('profil', [ProfilController::class, 'update']);
        Route::put('profil/password', [ProfilController::class, 'updatePassword']);
        Route::delete('profil', [ProfilController::class, 'destroy']);

        // RGPD
        Route::get('profil/export', [ProfilController::class, 'export']);
        Route::post('profil/anonymiser', [ProfilController::class, 'anonymiser']);

        // Émotions
        Route::get('emotions', [EmotionController::class, 'index']);

        // Tracker / Saisies
        Route::prefix('tracker')->group(function () {
            Route::get('saisies', [SaisieTrackerController::class, 'index']);
            Route::post('saisies', [SaisieTrackerController::class, 'store']);
            Route::put('saisies/{id}', [SaisieTrackerController::class, 'update']);
            Route::delete('saisies/{id}', [SaisieTrackerController::class, 'destroy']);
            Route::get('rapports', [SaisieTrackerController::class, 'rapports']);
        });
    });

    // ── Admin ──────────────────────────────────────────────
    Route::middleware(['jwt.auth', 'role:administrateur', 'throttle:60,1'])->prefix('admin')->group(function () {

        // Utilisateurs
        Route::get('utilisateurs', [AdminUtilisateurController::class, 'index']);
        Route::post('utilisateurs', [AdminUtilisateurController::class, 'store']);
        Route::get('utilisateurs/{id}', [AdminUtilisateurController::class, 'show']);
        Route::put('utilisateurs/{id}', [AdminUtilisateurController::class, 'update']);
        Route::patch('utilisateurs/{id}/toggle-active', [AdminUtilisateurController::class, 'toggleActive']);
        Route::delete('utilisateurs/{id}', [AdminUtilisateurController::class, 'destroy']);

        // Feeds / Contenus
        Route::get('feeds', [AdminFeedController::class, 'index']);
        Route::post('feeds', [AdminFeedController::class, 'store']);
        Route::put('feeds/{id}', [AdminFeedController::class, 'update']);
        Route::delete('feeds/{id}', [AdminFeedController::class, 'destroy']);

        // Émotions
        Route::get('emotions', [AdminEmotionController::class, 'index']);
        Route::post('emotions', [AdminEmotionController::class, 'store']);
        Route::put('emotions/{id}', [AdminEmotionController::class, 'update']);
        Route::delete('emotions/{id}', [AdminEmotionController::class, 'destroy']);
    });
});
