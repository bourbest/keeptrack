import { required, isEmail, validateEntity } from '../common/validate'

const matchesPassword = (confirmValue, entity) => {
  if (confirmValue && entity.password && confirmValue !== entity.password) {
    return 'accounts.errors.passwordNotMatching'
  }
  return null
}

const requiredIfNew = (value, entity) => {
  if (!entity.id) {
    return required(value, entity)
  }
  return null
}

export const AccountValidator = {
  'firstName': [required],
  'lastName': [required],
  'userName': [required],
  'email': [required, isEmail],
  'password': [requiredIfNew],
  'confirmPassword': [requiredIfNew, matchesPassword]
}

export default (entity, props) => {
  const errors = validateEntity(entity, AccountValidator)
  return errors
}
