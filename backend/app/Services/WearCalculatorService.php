<?php

namespace App\Services;

class WearCalculatorService
{
    public function calculateWearPercentage(int $currentKm, int $lastChangedKm, int $lifespanKm): int
    {
        $used = $currentKm - $lastChangedKm;
        return min(100, (int) round(($used / $lifespanKm) * 100));
    }

    public function getWearColor(int $percentage): string
    {
        if ($percentage >= 90) return 'red';
        if ($percentage >= 70) return 'orange';
        return 'green';
    }

    public function shouldSendAlert(int $percentage): bool
    {
        return $percentage >= 90;
    }

    public function getRemainingKm(int $currentKm, int $lastChangedKm, int $lifespanKm): int
    {
        $used = $currentKm - $lastChangedKm;
        return max(0, $lifespanKm - $used);
    }
}
