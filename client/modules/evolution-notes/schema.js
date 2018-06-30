import { Schema, number, string, date, boolean, required, validate, isInteger, withinRange } from 'sapin'
import { objectId } from '../common/validate'
export const evolutionNoteSchema = new Schema({
  clientId: objectId(required),
  note: string(required),
  minutes: number([required, isInteger, withinRange(1, 500)]),
  isArchived: boolean,
  createdOn: date,
  modifiedOn: date
})

export default (entity, props) => {
  const errors = validate(entity, evolutionNoteSchema)
  return errors
}
