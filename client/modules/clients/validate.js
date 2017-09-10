import { required, validateEntity } from '../common/validate'

export const ClientValidator = {
  'firstName': [required],
  'lastName': [required]
}

export default (entity, props) => {
  const errors = validateEntity(entity, ClientValidator)
  return errors
}
