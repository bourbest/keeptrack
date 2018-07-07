import ListOptionRepository from '../api/repository/ListOptionRepository'

export const loadCache = (database) => {
  const repo = new ListOptionRepository(database)
  return repo.findAll().then(options => {
    return {listOptions: options}
  })
}
