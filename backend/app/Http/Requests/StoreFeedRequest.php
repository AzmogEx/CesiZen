<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFeedRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'titre' => 'required|string|max:255',
            'contenu' => 'required|string',
            'image_url' => 'nullable|url|max:500',
            'est_publie' => 'boolean',
            'ordre' => 'integer|min:0',
        ];

        if ($this->isMethod('POST')) {
            $rules['slug'] = 'nullable|string|max:255|unique:feeds,slug';
        } else {
            $rules['slug'] = [
                'nullable',
                'string',
                'max:255',
                Rule::unique('feeds', 'slug')->ignore($this->route('id')),
            ];
        }

        return $rules;
    }
}
