import { required, validateEntity } from '../common/validate'

export const LoginValidator = {
  'username': [required],
  'password': [required]
}

export default (loginForm) => {
  const errors = validateEntity(loginForm, LoginValidator)
  return errors
}
