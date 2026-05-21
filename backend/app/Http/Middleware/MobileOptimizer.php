<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MobileOptimizer
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($request->header('X-Mobile-App') !== 'true') {
            return $response;
        }

        if ($response instanceof JsonResponse) {
            $data = $response->getData(true);
            $response->setData($this->toCamelCase($data));
        }

        return $response;
    }

    private function toCamelCase(array $data): array
    {
        $result = [];
        foreach ($data as $key => $value) {
            $camel = lcfirst(str_replace('_', '', ucwords($key, '_')));
            $result[$camel] = is_array($value) ? $this->toCamelCase($value) : $value;
        }
        return $result;
    }
}
