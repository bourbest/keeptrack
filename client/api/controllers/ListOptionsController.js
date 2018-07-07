import {ListOptionRepository} from '../repository'
import {makeFindAllHandler} from './StandardController'

export default (router) => {
  router.route('/list-options')
    .get(makeFindAllHandler(ListOptionRepository))
}
