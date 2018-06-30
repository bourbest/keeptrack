import {string, date, isEmail, arrayOf, isEqualToField, required, Schema, validate, boolean} from 'sapin'
import {objectId} from '../common/validate'

const baseSchema = {
  id: objectId,
  isArchived: boolean,
  username: string(required),
  firstName: string(required),
  lastName: string(required),
  organismRole: string(required),
  email: string(required, isEmail),
  password: string,
  confirmPassword: string(isEqualToField('password')),
  roles: arrayOf(string),
  createOn: date,
  modifiedOn: date
}

export const accountSchema = new Schema(baseSchema)

export const newAccountSchema = new Schema({
  ...baseSchema,
  password: string(required),
  confirmPassword: string(required, isEqualToField('password'))
})

export default (entity, props) => {
  const errors = props.isNew ? validate(entity, newAccountSchema) : validate(entity, accountSchema)
  return errors
}
