import {string, isEqualToField, required, Schema, validate} from 'sapin'

export const changePasswordSchema = new Schema({
  oldPassword: string(required),
  newPassword: string(required),
  confirmPassword: string([required, isEqualToField('newPassword')])
})

export const validateChangePassword = (entity) => {
  return validate(entity, changePasswordSchema)
}
