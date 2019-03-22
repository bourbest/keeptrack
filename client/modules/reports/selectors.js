import config from './config'
import {filter} from 'lodash'
import {createSelector} from 'reselect'
import { isSubmitting, getFormError, isValid, getFormValues } from 'redux-form'

import {buildSortedOptionList} from '../common/selectors'
import FormTemplateSelectors from '../form-templates/selectors'

const Selectors = {}

Selectors.getDistributionList = state => state[config.entityName].distributionList
Selectors.isFetchingDistributionList = state => state[config.entityName].isFetchingDistributionList

Selectors.getFormTemplateOptionList = createSelector(
  [FormTemplateSelectors.getEntities],
  (entities) => {
    const ret = filter(entities, entity => !entity.preventReport)
    return buildSortedOptionList(ret, 'name', 'id')
  }
)

Selectors.getParameterValues = getFormValues(config.entityName)
Selectors.getSubmitError = getFormError(config.entityName)
Selectors.isSubmitting = isSubmitting(config.entityName)
Selectors.isValid = isValid(config.entityName)

export default Selectors
