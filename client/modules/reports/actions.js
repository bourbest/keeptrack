import {initialize} from 'redux-form'
import config from './config'

export const ActionCreators = {
  setReportParameters: (entity) => initialize(config.entityName, entity)
}
