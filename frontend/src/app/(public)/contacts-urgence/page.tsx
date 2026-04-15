import Card from '@/components/ui/Card';
import { Phone } from 'lucide-react';

export default function ContactsUrgencePage() {
  const contacts = [
    {
      name: 'Numéro national de prévention du suicide',
      number: '3114',
      description:
        'Numéro national disponible 24h/24 et 7j/7. Appel gratuit et confidentiel pour les personnes en détresse psychologique et leur entourage.',
    },
    {
      name: 'SOS Amitié',
      number: '09 72 39 40 50',
      description:
        'Écoute et soutien pour les personnes en souffrance, solitude ou détresse morale. Service disponible 24h/24.',
    },
    {
      name: 'Fil Santé Jeunes',
      number: '0 800 235 236',
      description:
        'Ligne d\u2019écoute gratuite et anonyme pour les jeunes de 12 à 25 ans. Du lundi au dimanche de 9h à 23h.',
    },
    {
      name: 'SAMU',
      number: '15',
      description:
        'Service d\u2019aide médicale urgente. En cas d\u2019urgence vitale, appelez immédiatement le 15 ou le 112.',
    },
    {
      name: 'SOS Médecins',
      number: '3624',
      description:
        'Service de médecins disponible pour des consultations à domicile, 24h/24 et 7j/7.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Contacts d&apos;urgence
      </h1>
      <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
        Si vous ou un proche traversez une période difficile, n&apos;hésitez pas à
        contacter l&apos;un de ces services. Vous n&apos;êtes pas seul(e).
      </p>

      <div className="space-y-4">
        {contacts.map((contact) => (
          <Card key={contact.number}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center">
                <Phone size={20} className="text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {contact.name}
                </h2>
                <a
                  href={`tel:${contact.number.replace(/\s/g, '')}`}
                  className="inline-block text-xl font-bold text-malachite-600 dark:text-malachite-400 mb-2 hover:underline"
                >
                  {contact.number}
                </a>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {contact.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-8 bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900">
        <p className="text-sm text-red-700 dark:text-red-400 text-center leading-relaxed">
          <strong>En cas d&apos;urgence vitale</strong>, appelez immédiatement le{' '}
          <strong>15</strong> (SAMU) ou le <strong>112</strong> (numéro d&apos;urgence
          européen).
        </p>
      </Card>
    </div>
  );
}
