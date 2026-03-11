<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\JWTException;

class JwtMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        try {
            JWTAuth::parseToken()->authenticate();
        } catch (TokenExpiredException $e) {
            return response()->json(['message' => 'Token expiré'], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(['message' => 'Token invalide'], 401);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Token absent'], 401);
        }

        return $next($request);
    }
}
