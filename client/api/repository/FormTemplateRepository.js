import {addStartsWithCriteria, createBaseRepository} from './MongoRepository'
import {omit} from 'lodash'

const FormTemplateRepository = createBaseRepository('FormTemplate')

FormTemplateRepository.prototype.convertFilters = (filters) => {
  const ret = omit(filters, 'contains')
  if (filters.contains && filters.contains.length > 0) {
    addStartsWithCriteria(ret, 'name', filters.contains)
  }
  return ret
}
export default FormTemplateRepository
