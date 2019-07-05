import {string, date, arrayOf, isEqualToField, required, Schema, validate, boolean, requiredIfOtherFieldIsGiven} from 'sapin'
import {objectId} from '../common/validate'

const baseSchema = {
  id: objectId,
  isArchived: boolean,
  email: string, // legacy
  username: string(required),
  firstName: string(required),
  lastName: string(required),
  organismRole: string(required),
  password: string,
  confirmPassword: string([isEqualToField('password'), requiredIfOtherFieldIsGiven('password')]),
  roles: arrayOf(string),
  createdOn: date,
  modifiedOn: date
}

export const accountSchema = new Schema(baseSchema)

export const newAccountSchema = new Schema({
  ...baseSchema,
  password: string(required),
  confirmPassword: string([required, isEqualToField('password')])
})

export default (entity, props) => {
  const errors = props.isNew ? validate(entity, newAccountSchema) : validate(entity, accountSchema)
  return errors
}
