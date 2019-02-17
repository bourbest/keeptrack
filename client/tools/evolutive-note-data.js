module.exports = {
  name: 'Note évolutive',
  isArchived: false,
  isSystem: true,
  clientLink: 'MANDATORY',
  documentStatus: 'USE_DRAFT',
  documentDate: 'SET_BY_USER',
  documentDateLabels: {
    fr: 'Date de l\'échange',
    en: 'Exchange date'
  },
  fields: [
    {
      id: 'c1',
      controlType: 'grid',
      columnCount: 1,
      order: 0,
      parentId: 'c0'
    },
    {
      labels: {
        fr: 'Durée',
        en: 'Duration'
      },
      required: true,
      maxLength: null,
      id: 'minutes',
      controlType: 'input',
      order: 0,
      parentId: 'c1',
      isSystem: true,
    },
    {
      labels: {
        fr: 'Note',
        en: 'Note'
      },
      required: true,
      minHeight: '600',
      id: 'note',
      controlType: 'rich-text',
      order: 1,
      parentId: 'c1',
      isSystem: true,
      lockRequired: true
    }
  ],
  createdOn: '2019-02-17T02:52:34.712Z',
  modifiedOn: '2019-02-17T02:52:34.712Z',
  id: '5c68cc728942ac414cc80f58'
}
