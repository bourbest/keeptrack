import { required, validate } from 'sapin'

export const FormTemplateValidator = {
  'name': required
}

export default (entity, props) => {
  const errors = validate(entity, FormTemplateValidator)
  return errors
}
