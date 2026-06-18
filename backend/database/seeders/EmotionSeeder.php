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
        // Référentiel d'émotions conforme au sujet détaillé CESIZen (§7) :
        // 6 émotions de base (niveau 1) et leurs sous-émotions (niveau 2).
        // La colonne « Surprise » du sujet liste « Étonnement » en double (coquille) :
        // l'occurrence est dédupliquée ici. Total : 36 sous-émotions.
        $emotions = [
            [
                'nom' => 'Joie',
                'couleur' => '#FFD700',
                'icone' => '😊',
                'sous_emotions' => [
                    ['nom' => 'Fierté', 'couleur' => '#FFE44D'],
                    ['nom' => 'Contentement', 'couleur' => '#FFEB70'],
                    ['nom' => 'Enchantement', 'couleur' => '#FFF0A0'],
                    ['nom' => 'Excitation', 'couleur' => '#FFE333'],
                    ['nom' => 'Émerveillement', 'couleur' => '#FFED80'],
                    ['nom' => 'Gratitude', 'couleur' => '#FFF4B3'],
                ],
            ],
            [
                'nom' => 'Colère',
                'couleur' => '#DC143C',
                'icone' => '😠',
                'sous_emotions' => [
                    ['nom' => 'Frustration', 'couleur' => '#E34363'],
                    ['nom' => 'Irritation', 'couleur' => '#E9637F'],
                    ['nom' => 'Rage', 'couleur' => '#EF839B'],
                    ['nom' => 'Ressentiment', 'couleur' => '#E23355'],
                    ['nom' => 'Agacement', 'couleur' => '#E85373'],
                    ['nom' => 'Hostilité', 'couleur' => '#EE93A7'],
                ],
            ],
            [
                'nom' => 'Peur',
                'couleur' => '#9932CC',
                'icone' => '😰',
                'sous_emotions' => [
                    ['nom' => 'Inquiétude', 'couleur' => '#AD5BD6'],
                    ['nom' => 'Anxiété', 'couleur' => '#B96FDC'],
                    ['nom' => 'Terreur', 'couleur' => '#C583E2'],
                    ['nom' => 'Appréhension', 'couleur' => '#D197E8'],
                    ['nom' => 'Panique', 'couleur' => '#DDABEE'],
                    ['nom' => 'Crainte', 'couleur' => '#C97FE0'],
                ],
            ],
            [
                'nom' => 'Tristesse',
                'couleur' => '#4169E1',
                'icone' => '😢',
                'sous_emotions' => [
                    ['nom' => 'Chagrin', 'couleur' => '#6A8BE9'],
                    ['nom' => 'Mélancolie', 'couleur' => '#7D9BED'],
                    ['nom' => 'Abattement', 'couleur' => '#90ABF1'],
                    ['nom' => 'Désespoir', 'couleur' => '#A3BBF5'],
                    ['nom' => 'Solitude', 'couleur' => '#5A7DE5'],
                    ['nom' => 'Dépression', 'couleur' => '#87A1EF'],
                ],
            ],
            [
                'nom' => 'Surprise',
                'couleur' => '#FF8C00',
                'icone' => '😲',
                'sous_emotions' => [
                    ['nom' => 'Étonnement', 'couleur' => '#FFA333'],
                    ['nom' => 'Stupéfaction', 'couleur' => '#FFB666'],
                    ['nom' => 'Sidération', 'couleur' => '#FFC999'],
                    ['nom' => 'Incrédule', 'couleur' => '#FF9A1A'],
                    ['nom' => 'Émerveillement', 'couleur' => '#FFAD4D'],
                    ['nom' => 'Confusion', 'couleur' => '#FFC080'],
                ],
            ],
            [
                'nom' => 'Dégoût',
                'couleur' => '#228B22',
                'icone' => '🤢',
                'sous_emotions' => [
                    ['nom' => 'Répulsion', 'couleur' => '#4DA64D'],
                    ['nom' => 'Déplaisir', 'couleur' => '#66B366'],
                    ['nom' => 'Nausée', 'couleur' => '#80C080'],
                    ['nom' => 'Dédain', 'couleur' => '#3D9C3D'],
                    ['nom' => 'Horreur', 'couleur' => '#5CAC5C'],
                    ['nom' => 'Dégoût profond', 'couleur' => '#73BA73'],
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
