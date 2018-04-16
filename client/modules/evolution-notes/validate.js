import { required, validate, isInteger, withinRange } from 'sapin'

export const EvolutionNoteValidator = {
  'note': required,
  'minutes': [required, isInteger, withinRange(1, 500)]
}

export default (entity, props) => {
  const errors = validate(entity, EvolutionNoteValidator)
  return errors
}
