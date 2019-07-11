import {map, keyBy, without} from 'lodash'
export default {
  entityName: 'form-templates',
  fieldEditorFormName: 'formFieldEditor',
  testForm: 'testForm' // used in EditFormTemplate to simulate input and validations of currently edited form template
}

const BASE_CONTROL_PROPERTIES = ['labels']

const BASE_INPUT_PROPERTIES = [
  ...BASE_CONTROL_PROPERTIES,
  'required'
]

export const ALL_CONTROLS_PROPERTIES = [
  'labels.fr',
  'labels.en',
  'minValue',
  'maxValue',
  'choices',
  'maxFileSize',
  'maxLength',
  'minHeight'
]

export const ClientLinkOptions = {
  NO_LINK: 'NO_LINK',
  MANDATORY: 'MANDATORY'
}

export const DocumentDateOptions = {
  USE_CREATION_DATE: 'USE_CREATION_DATE',
  SET_BY_USER: 'SET_BY_USER'
}

export const DocumentStatusOptions = {
  NO_DRAFT: 'NO_DRAFT',
  USE_DRAFT: 'USE_DRAFT'
}

const CONTROL_CONFIGS = [
  {
    type: 'date',
    properties: [...BASE_INPUT_PROPERTIES, 'minValue', 'maxValue', 'useCurrentDateAsDefaultValue'],
    isInput: true
  },
  {
    type: 'checkbox',
    properties: without(BASE_INPUT_PROPERTIES, 'required'),
    isInput: true
  },
  {
    type: 'checkbox-list',
    properties: [...BASE_INPUT_PROPERTIES, 'choices'],
    isInput: true
  },
  {
    type: 'radio-list',
    properties: [...BASE_INPUT_PROPERTIES, 'choices'],
    isInput: true
  },
  {
    type: 'combobox',
    properties: [...BASE_INPUT_PROPERTIES, 'choices'],
    isInput: true
  },
  {
    type: 'input',
    properties: [...BASE_INPUT_PROPERTIES, 'maxLength'],
    isInput: true
  },
  {
    type: 'textarea',
    properties: [...BASE_INPUT_PROPERTIES, 'maxLength', 'minHeight'],
    isInput: true
  },
  {
    type: 'rich-text',
    properties: [...BASE_INPUT_PROPERTIES, 'minHeight'],
    isInput: true
  },
  {
    type: 'file',
    properties: [...BASE_INPUT_PROPERTIES, 'maxFileSize'],
    isInput: true
  },
  {
    type: 'title',
    properties: [...BASE_CONTROL_PROPERTIES, 'headerLevel']
  },
  {
    type: 'paragraph',
    properties: BASE_CONTROL_PROPERTIES
  },
  {
    type: 'grid',
    properties: ['columnCount'],
    isLayout: true
  },
  {
    type: 'address',
    properties: BASE_INPUT_PROPERTIES,
    isInput: true
  },
  {
    type: 'table',
    properties: ['columns', 'lines'],
    isInput: true
  }
]

export const CONTROL_CONFIG_BY_TYPE = keyBy(CONTROL_CONFIGS, 'type')

// liste des attributs qui peuvent être passés à un DOM Node
export const DOM_FIELD_OPTIONS = [
  'minValue', 'maxValue', 'maxLength', 'maxFileSize', 'required', 'headerLevel'
]

export const DEFAULT_CONTROL_OPTIONS = {
  labels: {fr: 'Nouveau champ', en: 'New field'},
  name: '',
  useCurrentDateAsDefaultValue: false,
  minValue: null,
  maxValue: null,
  choices: [
    {labels: {fr: 'Pommes', en: 'Apples'}, id: '1'},
    {labels: {fr: 'Bananes', en: 'Bananas'}, id: '2'},
    {labels: {fr: 'Oranges', en: 'Oranges'}, id: '3'}
  ], // choix possibles
  maxLength: null, // maxlenght des input / textarea
//  maxFileSize: 1024, // contrôle fichier seulement, taille en Ko, max 1024
  columnCount: 1,
  headerLevel: 1,
  required: false,
  minHeight: 200
}

export const FORM_CONTROLS = [
  {
    controlType: 'input',
    labels: {fr: 'Texte court', en: 'Short text'},
    image: '/public/images/controls/input.png',
    order: 0
  },
  {
    controlType: 'checkbox',
    labels: {fr: 'Case à cocher', en: 'Checkbox'},
    image: '/public/images/controls/checkbox.png',
    order: 1
  },
  {
    controlType: 'textarea',
    labels: {fr: 'Zone de texte', en: 'Text area'},
    image: '/public/images/controls/text-area.png',
    order: 2
  },
  {
    controlType: 'rich-text',
    labels: {fr: 'Texte riche', en: 'Rich text'},
    image: '/public/images/controls/text-area.png',
    order: 2
  },
  {
    controlType: 'radio-list',
    labels: {fr: 'Boutons radio', en: 'Radio buttons'},
    image: '/public/images/controls/radio-list.png',
    order: 3
  },
  {
    controlType: 'checkbox-list',
    labels: {fr: 'Cases à cocher', en: 'Checkbox list'},
    image: '/public/images/controls/checkbox-list.png',
    order: 4
  },
  {
    controlType: 'combobox',
    labels: {fr: 'Liste déroulante', en: 'Combobox'},
    image: '/public/images/controls/combobox.png',
    order: 5
  },
  {
    controlType: 'date',
    labels: {fr: 'Date', en: 'Date'},
    image: '/public/images/controls/date.png',
    order: 6
  },
  {
    controlType: 'title',
    labels: {fr: 'Titre', en: 'Title'},
    image: '/public/images/controls/title.png',
    order: 7
  },
  {
    controlType: 'paragraph',
    labels: {fr: 'Paragraphe', en: 'Paragraph'},
    image: '/public/images/controls/paragraph.png',
    order: 8
  },
  {
    controlType: 'address',
    labels: {fr: 'Adresse', en: 'Address'},
    image: '/public/images/controls/address.png',
    order: 9
  },
  {
    controlType: 'table',
    labels: {fr: 'Tableau', en: 'Table'},
    image: '/public/images/controls/address.png',
    order: 10
  }
]

export const CONTROL_TYPES = ['grid', ...map(FORM_CONTROLS, 'controlType')]
