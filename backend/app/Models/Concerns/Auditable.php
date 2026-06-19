<?php

namespace App\Models\Concerns;

use App\Models\Audit;
use Illuminate\Database\Eloquent\Model;

/**
 * Trait de traçabilité Eloquent.
 *
 * Ajoute automatiquement une ligne dans la table `audits` lors des
 * événements created / updated / deleted du modèle qui l'utilise.
 */
trait Auditable
{
    /**
     * Champs sensibles à ne jamais stocker dans l'audit.
     *
     * @var array<int, string>
     */
    protected static array $champsAuditExclus = [
        'password',
        'remember_token',
    ];

    /**
     * Enregistre les hooks d'audit sur les événements du modèle.
     */
    public static function bootAuditable(): void
    {
        static::created(function (Model $model) {
            $model->ecrireAudit('creation', null, $model->valeursAuditables($model->getAttributes()));
        });

        static::updated(function (Model $model) {
            $modifies = array_keys($model->getDirty());

            if ($modifies === []) {
                return;
            }

            $anciennes = $model->valeursAuditables($model->getOriginal());
            $nouvelles = $model->valeursAuditables($model->getDirty());

            $model->ecrireAudit(
                'modification',
                array_intersect_key($anciennes, $nouvelles),
                $nouvelles
            );
        });

        static::deleted(function (Model $model) {
            $model->ecrireAudit('suppression', $model->valeursAuditables($model->getAttributes()), null);
        });
    }

    /**
     * Filtre les champs sensibles d'un jeu d'attributs.
     *
     * @param  array<string, mixed>  $valeurs
     * @return array<string, mixed>
     */
    protected function valeursAuditables(array $valeurs): array
    {
        return array_diff_key($valeurs, array_flip(static::$champsAuditExclus));
    }

    /**
     * Insère une ligne d'audit.
     *
     * @param  array<string, mixed>|null  $anciennes
     * @param  array<string, mixed>|null  $nouvelles
     */
    protected function ecrireAudit(string $action, ?array $anciennes, ?array $nouvelles): void
    {
        Audit::create([
            'utilisateur_id' => auth()->id(),
            'action' => $action,
            'table_cible' => $this->getTable(),
            'enregistrement_id' => $this->getKey(),
            'anciennes_valeurs' => $anciennes,
            'nouvelles_valeurs' => $nouvelles,
            'ip_address' => request()->ip(),
        ]);
    }
}
