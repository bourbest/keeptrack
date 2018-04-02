import { required, isEmail, validate, requiredIfOtherFieldIsTrue } from 'sapin'
import {isDate, isPhone} from '../common/validate'
export const ClientValidator = {
  'firstName': required,
  'lastName': required,
  'gender': required,
  'email': isEmail,
  'birthDate': isDate,
  'originId': required,
  'mainPhoneNumber': {
    value: [isPhone, requiredIfOtherFieldIsTrue('canLeaveMessage')]
  },
  'alternatePhoneNumber': {
    value: [isPhone, requiredIfOtherFieldIsTrue('canLeaveMessage')]
  }
}

export default (entity, props) => {
  const errors = validate(entity, ClientValidator)
  return errors
}
