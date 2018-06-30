import { Schema, boolean, date, string, required, isEmail, validate, requiredIfOtherFieldIsTrue } from 'sapin'
import {isPhone, objectId} from '../common/validate'
export const clientSchema = new Schema({
  id: objectId,
  isArchived: boolean,
  firstName: string(required),
  lastName: string(required),
  fullName: string,
  gender: string(required),
  email: string(isEmail),
  birthDate: date,
  originId: string(required),
  mainPhoneNumber: {
    value: string([isPhone, requiredIfOtherFieldIsTrue('canLeaveMessage')]),
    canLeaveMessage: boolean
  },
  alternatePhoneNumber: {
    value: string([isPhone, requiredIfOtherFieldIsTrue('canLeaveMessage')]),
    canLeaveMessage: boolean
  },
  address: {
    civicNumber: string,
    streetName: string,
    app: string,
    city: string,
    postalCode: string
  },
  createdOn: date,
  modifiedOn: date
})

export default (entity, props) => {
  const errors = validate(entity, clientSchema)
  return errors
}
