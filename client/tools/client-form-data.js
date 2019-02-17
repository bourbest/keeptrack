module.exports = {  
   name: 'Participant',
   isArchived:false,
   isSystem: true,
   preventShortcut: true,
   fields:[{
      labels: {
        fr: 'Prénom',
        en: 'First name'
      },
      required: true,
      maxLength: null,
      id: 'firstName',
      controlType: 'input',
      order: 0,
      isSystem: true,
      lockLabels: true,
      lockRequired: true,
      parentId: 'c1'
    },
    {
      labels: {
        fr: 'Nom',
        en: 'Last name'
      },
      required: true,
      maxLength: null,
      id: 'lastName',
      controlType: 'input',
      order: 1,
      isSystem: true,
      lockLabels: true,
      lockRequired: true,
      parentId: 'c1'
    },
    {
      labels: {
        fr: 'Sexe',
        en: 'Gender'
      },
      required: true,
      lockChoiceValues: true,
      lockRequired: true,
      choices: [
        {
          labels: {
            fr: 'Homme',
            en: 'Male'
          },
          id: 'M',
          isSystem: true
        },
        {
          labels: {
            fr: 'Femme',
            en: 'Female'
          },
          id: 'F',
          isSystem: true
        }
      ],
      id: 'gender',
      controlType: 'radio-list',
      order: 2,
      isSystem: true,
      parentId: 'c1'
    },
    {
      labels: {
        fr: 'Date de naissance',
        en: 'Date of birth'
      },
      required: false,
      minValue: null,
      maxValue: null,
      useCurrentDateAsDefaultValue: false,
      id: 'birthDate',
      controlType: 'date',
      order: 3,
      isSystem: true,
      parentId: 'c1'
    },
    {
      labels: {
        fr: 'Lieu de résidence',
        en: 'Area'
      },
      required: false,
      choices: [
        {
          labels: {
            fr: '03 - Capitale Nationale',
            en: '03 - Capitale Nationale'
          },
          id: '1'
        },
        {
          labels: {
            fr: '12 - Chaudière-Appalaches',
            en: '12 - Chaudière-Appalaches'
          },
          id: '2'
        }
      ],
      id: 'originId',
      controlType: 'radio-list',
      order: 4,
      isSystem: false,
      parentId: 'c1'
    },
    {
      labels: {
        fr: 'Identification',
        en: 'Identification'
      },
      headerLevel: 1,
      id: 'c8',
      controlType: 'title',
      order: 0,
      parentId: 'c7'
    },
    {
      labels: {
        fr: 'Notes',
        en: 'Notes'
      },
      required: false,
      maxLength: null,
      id: 'notes',
      controlType: 'textarea',
      order: 0,
      isSystem: true,
      parentId: 'c11'
    },
    {
      labels: {
        fr: 'Coordonnées',
        en: 'Contact info'
      },
      headerLevel: 1,
      id: 'c10',
      controlType: 'title',
      order: 0,
      parentId: 'c9'
    },
    {
      labels: {
        fr: 'Courriel',
        en: 'Email'
      },
      required: false,
      maxLength: null,
      id: 'email',
      controlType: 'input',
      order: 0,
      isSystem: true,
      parentId: 'c14'
    },
    {
      labels: {
        fr: 'Accepte de recevoir des courriels',
        en: 'Accept to receive emails'
      },
      id: 'acceptPublipostage',
      controlType: 'checkbox',
      order: 1,
      isSystem: true,
      parentId: 'c14'
    },
    {
      labels: {
        fr: 'Téléphone principal',
        en: 'Main phone'
      },
      required: false,
      maxLength: null,
      id: 'mainPhoneNumber.value',
      controlType: 'input',
      order: 2,
      isSystem: true,
      parentId: 'c14'
    },
    {
      labels: {
        fr: 'Message',
        en: 'Message'
      },
      required: false,
      choices: [
        {
          value: 'noMessage',
          labels: {
            fr: 'Pas de message',
            en: 'No message'
          },
          id: 1
        },
        {
          value: 'nameAndPhoneOnly',
          labels: {
            fr: 'Nom et numéro seulement',
            en: 'Name and phone only'
          },
          id: 2
        },
        {
          value: 'fullMessage',
          labels: {
            fr: 'Message complet',
            en: 'Full message'
          },
          id: 3
        }
      ],
      id: 'mainPhoneNumber.messageOption',
      controlType: 'combobox',
      order: 3,
      isSystem: true,
      parentId: 'c14'
    },
    {
      labels: {
        fr: 'Téléphone secondaire',
        en: 'Alternate phone'
      },
      required: false,
      maxLength: null,
      id: 'alternatePhoneNumber.value',
      controlType: 'input',
      order: 4,
      isSystem: true,
      parentId: 'c14'
    },
    {
      labels: {
        fr: 'Message',
        en: 'Message'
      },
      required: false,
      choices: [
        {
          value: 'noMessage',
          labels: {
            fr: 'Pas de message',
            en: 'No message'
          },
          id: 1
        },
        {
          value: 'nameAndPhoneOnly',
          labels: {
            fr: 'Nom et numéro seulement',
            en: 'Name and phone only'
          },
          id: 2
        },
        {
          value: 'fullMessage',
          labels: {
            fr: 'Message complet',
            en: 'Full message'
          },
          id: 3
        }
      ],
      id: 'alternatePhoneNumber.messageOption',
      controlType: 'combobox',
      order: 5,
      isSystem: true,
      parentId: 'c14'
    },
    {
      columnCount: 1,
      id: 'c7',
      controlType: 'grid',
      order: 0,
      isSystem: true,
      parentId: 'c0'
    },
    {
      columnCount: '2',
      id: 'c1',
      controlType: 'grid',
      order: 1,
      parentId: 'c0'
    },
    {
      columnCount: 1,
      id: 'c11',
      controlType: 'grid',
      order: 2,
      isSystem: true,
      parentId: 'c0'
    },
    {
      columnCount: 1,
      id: 'c9',
      controlType: 'grid',
      order: 3,
      parentId: 'c0'
    },
    {
      columnCount: '2',
      id: 'c14',
      controlType: 'grid',
      order: 4,
      parentId: 'c0'
    },
    {
      columnCount: 1,
      id: 'c17',
      controlType: 'grid',
      order: 6,
      parentId: 'c0'
    },
    {
      labels: {
        fr: 'Adresse',
        en: 'Address'
      },
      headerLevel: 1,
      id: 'addressHeader',
      controlType: 'title',
      order: 0,
      parentId: 'c17'
    },
    {
      required: true,
      id: 'address',
      controlType: 'address',
      order: 1,
      parentId: 'c17',
      isSystem: true
    }
  ]
}
