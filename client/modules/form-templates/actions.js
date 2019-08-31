import config, {ALL_CONTROLS_PROPERTIES} from './config'
import { initialize, arrayPush, arrayRemove, touch } from 'redux-form'
import { createActions, createBaseActionCreators, standardActions } from '../common/actions'

const prefix = config.entityName.toUpperCase()

const BaseActions = createActions(prefix, standardActions)

const SpecificActions = createActions(prefix, [
  'FETCH_EDITED_FORM',
  'SET_EDITED_FORM_FIELDS',

  'ADD_FIELD',
  'MOVE_FIELD',
  'DELETE_FIELD',
  'UPDATE_FIELD_PROPERTIES',
  'TOGGLE_SHOW_ARCHIVED',
  'TOGGLE_SHOW_TEMPLATE_PROPERTIES',
  'MOVE_SECTION'
])

const BaseActionCreators = createBaseActionCreators(BaseActions, config.entityName)

const SpecificActionCreators = {
  fetchEditedEntity: (id) => ({type: SpecificActions.FETCH_EDITED_FORM, id}), // override default
  setEditedFormFields: (fields) => ({type: SpecificActions.SET_EDITED_FORM_FIELDS, fields}),

  // field editor actions
  setEditedField: (entity) => initialize(config.fieldEditorFormName, entity),

  showEditedFieldErrors: (entity) => touch(config.fieldEditorFormName, ...ALL_CONTROLS_PROPERTIES),

  addField: (field, parentId, beforeSiblingId) => ({type: SpecificActions.ADD_FIELD, field, parentId, beforeSiblingId}),
  deleteField: (fieldId) => ({type: SpecificActions.DELETE_FIELD, fieldId}),
  moveField: (fieldId, sourceParentId, targetParentId, beforeSiblingId) => ({type: SpecificActions.MOVE_FIELD, fieldId, sourceParentId, targetParentId, beforeSiblingId}),

  updateFieldProperties: (newProperties) => ({type: SpecificActions.UPDATE_FIELD_PROPERTIES, newProperties}),
  addChoice: (choice) => (arrayPush(config.fieldEditorFormName, 'choices', choice)),
  addColumn: column => (arrayPush(config.fieldEditorFormName, 'columns', column)),
  addLine: line => (arrayPush(config.fieldEditorFormName, 'lines', line)),

  toggleShowArchivedChoices: () => ({type: SpecificActions.TOGGLE_SHOW_ARCHIVED, itemType: 'showArchivedChoices'}),
  toggleShowArchivedColumns: () => ({type: SpecificActions.TOGGLE_SHOW_ARCHIVED, itemType: 'showArchivedColumns'}),
  toggleShowArchivedLines: () => ({type: SpecificActions.TOGGLE_SHOW_ARCHIVED, itemType: 'showArchivedLines'}),
  toggleShowTemplateProperties: () => ({type: SpecificActions.TOGGLE_SHOW_TEMPLATE_PROPERTIES}),
  moveSection: (sectionId, direction) => ({type: SpecificActions.MOVE_SECTION, sectionId, direction}),

  deleteFileExtension: (index) => (arrayRemove(config.fieldEditorFormName, 'acceptedFileExtensions', index)),
  addFileExtension: (ext) => (arrayPush(config.fieldEditorFormName, 'acceptedFileExtensions', ext)),

  createEntity: (entity, callback = null) => ({ type: BaseActions.CREATE_REMOTE_ENTITY, entity, callback }),
  updateEntity: (entity, callback = null) => ({ type: BaseActions.UPDATE_REMOTE_ENTITY, entity, callback })
}

export const Actions = {...BaseActions, ...SpecificActions}
export const ActionCreators = {...BaseActionCreators, ...SpecificActionCreators}
