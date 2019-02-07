import config from './config'
import {map, omit, filter} from 'lodash'
import { createBaseSelectors, buildSortedOptionList } from '../common/selectors'
import FormTemplateSelectors from '../form-templates/selectors'
import {createSelector} from 'reselect'

const Selectors = createBaseSelectors(config.entityName)

Selectors.buildNewEntity = () => {
  let newEntity = {
    labels: {
      fr: 'Nouveau raccourci',
      en: 'New shortcut'
    },
    isArchived: false
  }
  return newEntity
}

Selectors.getFormTemplateOptions = createSelector(
  [FormTemplateSelectors.getEntities, Selectors.getEntities, Selectors.getEditedEntity],
  (formTemplates, formShortcuts, editedShortcut) => {
    const currentId = editedShortcut ? editedShortcut.id : null
    const usedShortcuts = omit(formShortcuts, currentId)
    const formIds = new Set(map(usedShortcuts, 'formTemplateId'))
    const validFormTemplates = filter(formTemplates, template => {
      return !formIds.has(template.id) && !template.isSystem
    })

    return buildSortedOptionList(validFormTemplates, 'name')
  }
)

export default Selectors
