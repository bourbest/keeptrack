import moment from 'moment'

export default [
  {
    name: 'text',
    label: 'Texte',
    type: 'text',
    value: 'John Doe',
    defaultAttributes: {
      label: 'Nouveau champ texte'
    }
  },
  {
    name: 'date',
    label: 'Date',
    type: 'date',
    value: moment('2017-01-01'),
    defaultAttributes: {
      label: 'Nouveau champ date'
    }
  },
  {
    name: 'textarea',
    label: 'Zone texte',
    type: 'textarea',
    value: 'Bonjour\nVoici du texte',
    defaultAttributes: {
      label: 'Nouvelle zone de texte',
      height: 100
    }
  },
  {
    name: 'choix_multiple',
    label: 'Choix multiple',
    type: 'choices',
    allowMultipleChoices: true,
    value: ['1'],
    choices: [
      {
        label: 'Cerise',
        value: 'c1',
        order: 0
      },
      {
        label: 'Pomme',
        value: 'c2',
        order: 1
      }
    ],
    defaultAttributes: {
      label: 'Nouveau choix multiple',
      allowMultipleChoices: true,
      choices: [
        {
          label: 'Choix 1',
          value: 'c1',
          order: 0
        },
        {
          label: 'Choix 2',
          value: 'c2',
          order: 1
        }
      ]
    }
  },
  {
    name: 'choix_unique',
    label: 'Choix simple',
    type: 'choices',
    allowMultipleChoices: false,
    value: 'c1',
    choices: [
      {
        label: 'Cerise',
        value: 'c1',
        order: 0
      },
      {
        label: 'Pomme',
        value: 'c2',
        order: 1
      }
    ],
    defaultAttributes: {
      label: 'Nouveau choix unique',
      allowMultipleChoices: false,
      choices: [
        {
          label: 'Choix 1',
          value: 'c1',
          order: 0
        },
        {
          label: 'Choix 2',
          value: 'c2',
          order: 1
        }
      ]
    }
  }
]
