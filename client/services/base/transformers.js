import moment from 'moment'

export const dateFromApi = (apiDate) => {
  let ret = ''
  if (apiDate) {
    ret = moment(apiDate).format()
  }
  return ret
}

export const dateToApi = (clientDate) => {
  let ret = null
  if (clientDate && clientDate !== '') {
    ret = moment(clientDate).format()
  }
  return ret
}
export const percentageToApi = value => value / 100
export const percentageFromApi = value => value * 100
