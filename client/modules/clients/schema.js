import { Schema, oneOf, boolean, date, string, required, isEmail, validate, requiredIfOtherFieldIsGiven } from 'sapin'
import {isPhone, objectId} from '../common/validate'

const messageOptionValidator = string([
  requiredIfOtherFieldIsGiven('value'),
  oneOf(['noMessage', 'fullMessage', 'nameAndPhoneOnly'])
])

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
    value: string(isPhone),
    messageOption: messageOptionValidator
  },
  alternatePhoneNumber: {
    value: string(isPhone),
    messageOption: messageOptionValidator
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
