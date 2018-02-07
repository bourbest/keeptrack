import {keyBy, without} from 'lodash'
export default {
  entityName: 'form-templates',
  fieldEditorFormName: 'formFieldEditor',
  testForm: 'testForm' // used in EditFormTemplate to simulate input and validations of currently edited form template
}

const BASE_CONTROL_PROPERTIES = ['labels']

const BASE_INPUT_PROPERTIES = [
  ...BASE_CONTROL_PROPERTIES,
  'isRequired'
]

export const ALL_CONTROLS_PROPERTIES = [
  'labels.fr',
  'labels.en',
  'minValue',
  'maxValue',
  'choices',
  'maxFileSize',
  'maxLength'
]

const CONTROL_CONFIGS = [
  {
    type: 'date',
    properties: [...BASE_INPUT_PROPERTIES, 'minValue', 'maxValue', 'useCurrentDateAsDefaultValue'],
    isInput: true
  },
  {
    type: 'checkbox',
    properties: without(BASE_INPUT_PROPERTIES, 'isRequired'),
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
    type: 'rating',
    properties: [...BASE_INPUT_PROPERTIES, 'maxValue'],
    isInput: true
  },
  {
    type: 'input',
    properties: [...BASE_INPUT_PROPERTIES, 'maxLength'],
    isInput: true
  },
  {
    type: 'textarea',
    properties: [...BASE_INPUT_PROPERTIES, 'maxLength'],
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
  maxValue: 10,
  choices: [
    {value: '1', labels: {fr: 'Pommes', en: 'Apples'}, id: 1},
    {value: '2', labels: {fr: 'Bananes', en: 'Bananas'}, id: 2},
    {value: '3', labels: {fr: 'Oranges', en: 'Oranges'}, id: 3}
  ], // choix possibles
  maxLength: null, // maxlenght des input / textarea
  maxFileSize: 1024, // contrôle fichier seulement, taille en Ko, max 1024
  columnCount: 1,
  headerLevel: 1,
  required: false
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
    controlType: 'rating',
    labels: {fr: 'Échelle', en: 'Rating'},
    image: '/public/images/controls/rating.png',
    order: 9
  }
]
