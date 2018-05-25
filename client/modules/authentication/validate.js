import { Schema, string, required, validate } from 'sapin'

export const loginSchema = new Schema({
  'username': string(required),
  'password': string(required)
})

export default (loginForm) => {
  const errors = validate(loginForm, loginSchema)
  return errors
}
