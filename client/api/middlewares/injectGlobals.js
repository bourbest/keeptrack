export function injectGlobals (globals) {
  return function (req, res, next) {
    for (let prop in globals) {
      req[prop] = globals[prop]
    }
    next()
  }
}
