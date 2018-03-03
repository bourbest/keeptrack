import { required, validateEntity } from '../common/validate'

export const FormTemplateValidator = {
  'name': [required]
}

export default (entity, props) => {
  const errors = validateEntity(entity, FormTemplateValidator)
  return errors
}
