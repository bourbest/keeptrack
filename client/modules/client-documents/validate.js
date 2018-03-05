import { required, isEmail, validateEntity } from '../common/validate'

export const ClientValidator = {
  'firstName': [required],
  'lastName': [required],
  'gender': [required],
  'email': [isEmail]
}

export default (entity, props) => {
  const errors = validateEntity(entity, ClientValidator)
  return errors
}