<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmotionSeeder extends Seeder
{
    /**
     * Insérer les émotions de niveau 1 et leurs sous-émotions de niveau 2.
     */
    public function run(): void
    {
        $emotions = [
            [
                'nom' => 'Joie',
                'couleur' => '#FFD700',
                'icone' => '😊',
                'sous_emotions' => [
                    ['nom' => 'Bonheur', 'couleur' => '#FFE44D'],
                    ['nom' => 'Gratitude', 'couleur' => '#FFEB70'],
                    ['nom' => 'Sérénité', 'couleur' => '#FFF0A0'],
                    ['nom' => 'Enthousiasme', 'couleur' => '#FFE333'],
                    ['nom' => 'Fierté', 'couleur' => '#FFED80'],
                    ['nom' => 'Espoir', 'couleur' => '#FFF4B3'],
                ],
            ],
            [
                'nom' => 'Tristesse',
                'couleur' => '#4169E1',
                'icone' => '😢',
                'sous_emotions' => [
                    ['nom' => 'Mélancolie', 'couleur' => '#6A8BE9'],
                    ['nom' => 'Solitude', 'couleur' => '#7D9BED'],
                    ['nom' => 'Déception', 'couleur' => '#90ABF1'],
                    ['nom' => 'Nostalgie', 'couleur' => '#A3BBF5'],
                    ['nom' => 'Chagrin', 'couleur' => '#5A7DE5'],
                ],
            ],
            [
                'nom' => 'Colère',
                'couleur' => '#DC143C',
                'icone' => '😠',
                'sous_emotions' => [
                    ['nom' => 'Frustration', 'couleur' => '#E34363'],
                    ['nom' => 'Irritation', 'couleur' => '#E9637F'],
                    ['nom' => 'Agacement', 'couleur' => '#EF839B'],
                    ['nom' => 'Rage', 'couleur' => '#E23355'],
                    ['nom' => 'Indignation', 'couleur' => '#E85373'],
                ],
            ],
            [
                'nom' => 'Peur',
                'couleur' => '#9932CC',
                'icone' => '😰',
                'sous_emotions' => [
                    ['nom' => 'Anxiété', 'couleur' => '#AD5BD6'],
                    ['nom' => 'Inquiétude', 'couleur' => '#B96FDC'],
                    ['nom' => 'Panique', 'couleur' => '#C583E2'],
                    ['nom' => 'Stress', 'couleur' => '#D197E8'],
                    ['nom' => 'Appréhension', 'couleur' => '#DDABEE'],
                ],
            ],
            [
                'nom' => 'Dégoût',
                'couleur' => '#228B22',
                'icone' => '🤢',
                'sous_emotions' => [
                    ['nom' => 'Aversion', 'couleur' => '#4DA64D'],
                    ['nom' => 'Répulsion', 'couleur' => '#66B366'],
                    ['nom' => 'Mépris', 'couleur' => '#80C080'],
                    ['nom' => 'Écœurement', 'couleur' => '#3D9C3D'],
                ],
            ],
            [
                'nom' => 'Surprise',
                'couleur' => '#FF8C00',
                'icone' => '😲',
                'sous_emotions' => [
                    ['nom' => 'Étonnement', 'couleur' => '#FFA333'],
                    ['nom' => 'Stupéfaction', 'couleur' => '#FFB666'],
                    ['nom' => 'Émerveillement', 'couleur' => '#FFC999'],
                    ['nom' => 'Choc', 'couleur' => '#FF9A1A'],
                ],
            ],
            [
                'nom' => 'Amour',
                'couleur' => '#FF69B4',
                'icone' => '💕',
                'sous_emotions' => [
                    ['nom' => 'Tendresse', 'couleur' => '#FF87C3'],
                    ['nom' => 'Affection', 'couleur' => '#FFA5D2'],
                    ['nom' => 'Compassion', 'couleur' => '#FFC3E1'],
                    ['nom' => 'Admiration', 'couleur' => '#FF96CA'],
                ],
            ],
        ];

        $now = now();

        foreach ($emotions as $emotionData) {
            // Insérer l'émotion de niveau 1
            $parentId = DB::table('emotions')->insertGetId([
                'nom' => $emotionData['nom'],
                'couleur' => $emotionData['couleur'],
                'icone' => $emotionData['icone'],
                'niveau' => 1,
                'parent_id' => null,
                'est_actif' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            // Insérer les sous-émotions de niveau 2
            foreach ($emotionData['sous_emotions'] as $sousEmotion) {
                DB::table('emotions')->insert([
                    'nom' => $sousEmotion['nom'],
                    'couleur' => $sousEmotion['couleur'],
                    'icone' => $emotionData['icone'],
                    'niveau' => 2,
                    'parent_id' => $parentId,
                    'est_actif' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
    }
}
