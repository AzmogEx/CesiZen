<?php

namespace App\Services;

use App\Models\Utilisateur;
use Carbon\Carbon;

class RapportService
{
    public function genererRapport(Utilisateur $user, string $period): array
    {
        $tracker = $user->tracker;

        if (! $tracker) {
            return $this->rapportVide();
        }

        $dateDebut = $this->getDateDebut($period);
        $dateFin = Carbon::now();

        $saisies = $tracker->saisies()
            ->with('emotion')
            ->where('date_saisie', '>=', $dateDebut)
            ->where('date_saisie', '<=', $dateFin)
            ->orderBy('date_saisie')
            ->get();

        if ($saisies->isEmpty()) {
            return $this->rapportVide();
        }

        $totalSaisies = $saisies->count();
        $intensiteMoyenne = round($saisies->avg('intensite'), 1);

        $emotionsDominantes = $saisies->groupBy('emotion_id')
            ->map(fn ($group) => [
                'emotion' => $group->first()->emotion,
                'count' => $group->count(),
                'intensite_moyenne' => round($group->avg('intensite'), 1),
            ])
            ->sortByDesc('count')
            ->values();

        $emotionDominante = $emotionsDominantes->first();

        $evolution = $this->getEvolution($saisies, $period, $dateDebut, $dateFin);

        $repartition = $emotionsDominantes->map(fn ($item) => [
            'nom' => $item['emotion']->nom,
            'couleur' => $item['emotion']->couleur,
            'icone' => $item['emotion']->icone,
            'count' => $item['count'],
            'pourcentage' => round(($item['count'] / $totalSaisies) * 100, 1),
            'intensite_moyenne' => $item['intensite_moyenne'],
        ])->values();

        return [
            'periode' => $period,
            'date_debut' => $dateDebut->toDateString(),
            'date_fin' => $dateFin->toDateString(),
            'stats' => [
                'total_saisies' => $totalSaisies,
                'intensite_moyenne' => $intensiteMoyenne,
                'emotion_dominante' => $emotionDominante ? [
                    'nom' => $emotionDominante['emotion']->nom,
                    'couleur' => $emotionDominante['emotion']->couleur,
                    'icone' => $emotionDominante['emotion']->icone,
                    'count' => $emotionDominante['count'],
                ] : null,
            ],
            'repartition' => $repartition,
            'evolution' => $evolution,
        ];
    }

    private function getDateDebut(string $period): Carbon
    {
        return match ($period) {
            'week' => Carbon::now()->subWeek(),
            'month' => Carbon::now()->subMonth(),
            'quarter' => Carbon::now()->subMonths(3),
            'year' => Carbon::now()->subYear(),
            default => Carbon::now()->subMonth(),
        };
    }

    private function getEvolution($saisies, string $period, Carbon $dateDebut, Carbon $dateFin): array
    {
        $format = match ($period) {
            'week' => 'Y-m-d',
            'month' => 'Y-m-d',
            'quarter' => 'Y-W',
            'year' => 'Y-m',
            default => 'Y-m-d',
        };

        $grouped = $saisies->groupBy(fn ($saisie) => $saisie->date_saisie->format($format));

        $labels = [];
        $dataIntensiteMoyenne = [];

        foreach ($grouped as $label => $group) {
            $labels[] = $label;
            $dataIntensiteMoyenne[] = round($group->avg('intensite'), 1);
        }

        $emotionDatasets = $saisies->groupBy('emotion_id')->map(function ($emotionGroup) use ($format, $grouped) {
            $emotion = $emotionGroup->first()->emotion;
            $byPeriod = $emotionGroup->groupBy(fn ($s) => $s->date_saisie->format($format));

            $data = [];
            foreach ($grouped->keys() as $label) {
                $data[] = isset($byPeriod[$label]) ? $byPeriod[$label]->count() : 0;
            }

            return [
                'nom' => $emotion->nom,
                'couleur' => $emotion->couleur,
                'data' => $data,
            ];
        })->values();

        return [
            'labels' => $labels,
            'intensite_moyenne' => $dataIntensiteMoyenne,
            'emotions' => $emotionDatasets,
        ];
    }

    private function rapportVide(): array
    {
        return [
            'periode' => 'month',
            'date_debut' => Carbon::now()->subMonth()->toDateString(),
            'date_fin' => Carbon::now()->toDateString(),
            'stats' => [
                'total_saisies' => 0,
                'intensite_moyenne' => 0,
                'emotion_dominante' => null,
            ],
            'repartition' => [],
            'evolution' => [
                'labels' => [],
                'intensite_moyenne' => [],
                'emotions' => [],
            ],
        ];
    }
}
