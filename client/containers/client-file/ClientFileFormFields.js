export default [
  {
    name: 'firstName',
    type: 'text',
    isRequired: true,
    label: 'Prénom'
  },
  {
    name: 'lastName',
    type: 'text',
    isRequired: true,
    label: 'Nom'
  },
  {
    name: 'email',
    type: 'text',
    isRequired: false,
    label: 'Courriel'
  },
  {
    name: 'gender',
    type: 'choices',
    isRequired: false,
    allowMultiple: false,
    label: 'Sexe',
    choices: [
      {
        value: 'M',
        label: 'Homme'
      },
      {
        value: 'F',
        label: 'Femme'
      }
    ]
  },
  {
    name: 'notes',
    type: 'textarea',
    isRequired: false,
    label: 'Notes'
  }
]
