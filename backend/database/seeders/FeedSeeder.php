<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FeedSeeder extends Seeder
{
    /**
     * Créer les pages de contenu par défaut.
     */
    public function run(): void
    {
        // Idempotent : évite de dupliquer les contenus si le seed est relancé.
        if (DB::table('feeds')->exists()) {
            return;
        }

        $now = now();

        $feeds = [
            [
                'titre' => 'Bienvenue sur CESIZen',
                'slug' => 'bienvenue',
                'contenu' => '<h2>Bienvenue sur CESIZen, votre compagnon de bien-être</h2>
<p>CESIZen est une plateforme dédiée à la gestion du stress et au suivi émotionnel, développée en partenariat avec le Ministère des Solidarités et de la Santé. Notre mission est de vous accompagner au quotidien dans la compréhension et la gestion de vos émotions.</p>
<p>Grâce à notre <strong>tracker d\'émotions</strong>, vous pouvez enregistrer vos ressentis tout au long de la journée, suivre leur évolution dans le temps et mieux comprendre les situations qui influencent votre état émotionnel. Chaque saisie est confidentielle et sécurisée.</p>
<p>Explorez nos articles dans la rubrique <strong>Informations</strong> pour découvrir des ressources sur la santé mentale, des techniques de relaxation et des conseils pratiques pour améliorer votre bien-être au quotidien. N\'hésitez pas à créer votre compte pour profiter de toutes les fonctionnalités de la plateforme.</p>',
                'image_url' => null,
                'est_publie' => true,
                'auteur_id' => 1,
                'ordre' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'titre' => 'Comprendre le stress',
                'slug' => 'comprendre-le-stress',
                'contenu' => '<h2>Qu\'est-ce que le stress ?</h2>
<p>Le stress est une réaction naturelle de l\'organisme face à une situation perçue comme menaçante ou exigeante. Il mobilise nos ressources physiques et mentales pour faire face aux défis du quotidien. À court terme, le stress peut être bénéfique : il nous aide à rester concentrés, à réagir rapidement et à nous adapter. On parle alors de <strong>stress positif</strong> ou <em>eustress</em>.</p>
<p>Cependant, lorsque le stress devient chronique, il peut avoir des conséquences néfastes sur notre santé. Un stress prolongé peut entraîner des troubles du sommeil, des maux de tête, des tensions musculaires, une baisse de l\'immunité, et favoriser l\'apparition de troubles anxieux ou dépressifs. Il est donc essentiel d\'apprendre à reconnaître les signes d\'un stress excessif.</p>
<h3>Les principaux facteurs de stress</h3>
<p>Les sources de stress sont multiples et varient d\'une personne à l\'autre. Parmi les plus courantes, on retrouve : la <strong>charge de travail</strong> excessive, les <strong>conflits interpersonnels</strong>, les <strong>changements de vie</strong> importants (déménagement, séparation, nouveau poste), les <strong>difficultés financières</strong> et l\'<strong>incertitude</strong> face à l\'avenir. Identifier vos propres déclencheurs est la première étape pour mieux gérer votre stress.</p>
<p>Le tracker d\'émotions de CESIZen peut vous aider à repérer les moments et les situations où votre niveau de stress augmente. En enregistrant régulièrement vos ressentis, vous pourrez identifier des schémas récurrents et mettre en place des stratégies adaptées.</p>',
                'image_url' => null,
                'est_publie' => true,
                'auteur_id' => 1,
                'ordre' => 2,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'titre' => 'Techniques de relaxation',
                'slug' => 'techniques-relaxation',
                'contenu' => '<h2>Des outils simples pour retrouver le calme</h2>
<p>La relaxation est un ensemble de techniques qui permettent de réduire les tensions physiques et mentales liées au stress. Pratiquées régulièrement, elles contribuent à améliorer la qualité de vie, le sommeil et la concentration. Voici quelques méthodes accessibles à tous.</p>
<h3>La respiration profonde</h3>
<p>La technique de respiration 4-7-8 est l\'une des plus efficaces pour calmer rapidement le système nerveux. Inspirez par le nez pendant <strong>4 secondes</strong>, retenez votre souffle pendant <strong>7 secondes</strong>, puis expirez lentement par la bouche pendant <strong>8 secondes</strong>. Répétez ce cycle 3 à 4 fois. Cette méthode active le système nerveux parasympathique et favorise un état de détente profonde.</p>
<h3>La cohérence cardiaque</h3>
<p>La cohérence cardiaque consiste à adopter un rythme respiratoire régulier de <strong>6 respirations par minute</strong> pendant 5 minutes. Inspirez pendant 5 secondes, expirez pendant 5 secondes. Pratiquée 3 fois par jour (matin, midi et soir), cette technique a des effets prouvés sur la réduction du cortisol, l\'hormone du stress.</p>
<h3>La méditation de pleine conscience</h3>
<p>La pleine conscience, ou <em>mindfulness</em>, consiste à porter son attention sur le moment présent, sans jugement. Asseyez-vous confortablement, fermez les yeux et concentrez-vous sur vos sensations corporelles, votre respiration ou les sons qui vous entourent. Même 5 minutes par jour peuvent faire une différence significative sur votre niveau de stress et votre bien-être général.</p>',
                'image_url' => null,
                'est_publie' => true,
                'auteur_id' => 1,
                'ordre' => 3,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'titre' => 'Quand consulter un professionnel',
                'slug' => 'quand-consulter',
                'contenu' => '<h2>Reconnaître les signes qui doivent alerter</h2>
<p>Il est tout à fait normal de traverser des périodes de stress ou de tristesse. Cependant, certains signes indiquent qu\'il est temps de solliciter l\'aide d\'un professionnel de santé mentale. Reconnaître ces signaux est un acte de courage, pas de faiblesse.</p>
<h3>Les signes à surveiller</h3>
<p>Consultez un professionnel si vous observez un ou plusieurs de ces symptômes de manière persistante (plus de deux semaines) : <strong>troubles du sommeil</strong> importants (insomnie ou hypersomnie), <strong>perte d\'intérêt</strong> pour les activités que vous aimiez, <strong>difficultés de concentration</strong>, <strong>irritabilité</strong> inhabituelle, <strong>fatigue</strong> constante malgré le repos, <strong>isolement social</strong>, ou des <strong>pensées négatives</strong> récurrentes.</p>
<h3>Vers qui se tourner ?</h3>
<p>Plusieurs professionnels peuvent vous accompagner. Votre <strong>médecin traitant</strong> est souvent le premier interlocuteur : il peut évaluer votre situation et vous orienter. Les <strong>psychologues</strong> proposent un accompagnement par la parole, tandis que les <strong>psychiatres</strong>, médecins spécialisés, peuvent prescrire un traitement médicamenteux si nécessaire. N\'hésitez pas non plus à contacter les <strong>lignes d\'écoute</strong> gratuites et anonymes en cas de besoin urgent.</p>
<p><strong>Numéros utiles :</strong> SOS Amitié (09 72 39 40 50), Fil Santé Jeunes (0 800 235 236), Numéro national de prévention du suicide (3114). Ces services sont disponibles 24h/24 et 7j/7.</p>',
                'image_url' => null,
                'est_publie' => true,
                'auteur_id' => 1,
                'ordre' => 4,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        foreach ($feeds as $feed) {
            DB::table('feeds')->updateOrInsert(
                ['slug' => $feed['slug']],
                $feed
            );
        }
    }
}
