<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSaisieRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'emotion_id' => 'required|exists:emotions,id',
            'intensite' => 'required|integer|between:1,10',
            'note' => 'nullable|string|max:2000',
            'date_saisie' => 'required|date_format:Y-m-d',
        ];
    }

    public function messages(): array
    {
        return [
            'emotion_id.required' => 'L\'émotion est obligatoire.',
            'emotion_id.exists' => 'Cette émotion n\'existe pas.',
            'intensite.required' => 'L\'intensité est obligatoire.',
            'intensite.between' => 'L\'intensité doit être entre 1 et 10.',
            'date_saisie.required' => 'La date est obligatoire.',
        ];
    }
}
