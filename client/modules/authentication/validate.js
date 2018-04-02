import { required, validate } from 'sapin'

export const LoginValidator = {
  'username': required,
  'password': required
}

export default (loginForm) => {
  const errors = validate(loginForm, LoginValidator)
  return errors
}
