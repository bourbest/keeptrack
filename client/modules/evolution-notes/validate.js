import { Schema, number, string, required, validate, isInteger, withinRange } from 'sapin'

export const evolutionNoteSchema = new Schema({
  'note': string(required),
  'minutes': number([required, isInteger, withinRange(1, 500)])
})

export default (entity, props) => {
  const errors = validate(entity, evolutionNoteSchema)
  return errors
}
