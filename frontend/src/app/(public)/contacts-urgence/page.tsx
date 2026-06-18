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
        'Ligne d’écoute gratuite et anonyme pour les jeunes de 12 à 25 ans. Du lundi au dimanche de 9h à 23h.',
    },
    {
      name: 'SAMU',
      number: '15',
      description:
        'Service d’aide médicale urgente. En cas d’urgence vitale, appelez immédiatement le 15 ou le 112.',
    },
    {
      name: 'SOS Médecins',
      number: '3624',
      description:
        'Service de médecins disponible pour des consultations à domicile, 24h/24 et 7j/7.',
    },
  ];

  return (
    <div className="fr-container fr-py-6w">
      <h1>Contacts d&apos;urgence</h1>
      <p className="fr-text--lead">
        Si vous ou un proche traversez une période difficile, n&apos;hésitez pas
        à contacter l&apos;un de ces services. Vous n&apos;êtes pas seul(e).
      </p>

      <div className="fr-callout fr-callout--brown-caramel fr-icon-information-line fr-mb-6w">
        <p className="fr-callout__title">En cas d&apos;urgence ou de détresse</p>
        <p className="fr-callout__text">
          Appelez le <strong>3114</strong> (numéro national de prévention du
          suicide, gratuit, 24h/24) ou le <strong>15</strong> (SAMU). En cas
          d&apos;urgence vitale, composez le <strong>112</strong> (numéro
          d&apos;urgence européen).
        </p>
      </div>

      <div className="fr-grid-row fr-grid-row--gutters">
        {contacts.map((contact) => (
          <div className="fr-col-12 fr-col-md-6" key={contact.number}>
            <div className="fr-card">
              <div className="fr-card__body">
                <div className="fr-card__content">
                  <h2 className="fr-card__title">{contact.name}</h2>
                  <p className="fr-card__desc">{contact.description}</p>
                  <div className="fr-card__end">
                    <p className="fr-card__detail">
                      <a
                        className="fr-link"
                        href={`tel:${contact.number.replace(/\s/g, '')}`}
                      >
                        <span
                          className="fr-icon-phone-line fr-mr-1w"
                          aria-hidden="true"
                        />
                        {contact.number}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
