export const buildInstanceFromFields = (fields) => {
  const instance = {}
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]
    instance[field.name] = field.defaultValue || null
  }
  return instance
}
