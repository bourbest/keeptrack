import {
  get,
  forEach,
  isEmpty,
  isObject,
  isFunction
} from 'lodash'

const trErrorCodes = {
  400: 'app.error.API_BAD_REQUEST',
  401: 'app.error.AUTH_NOT_AUTHENTICATED',
  403: 'app.error.AUTH_FORBIDDEN',
  404: 'app.error.NOT_FOUND',
  500: 'app.error.API_SERVER_ERROR'
}

let _centreInstance = null
export class EventCentre {

  constructor () {
    if (!_centreInstance) {
      _centreInstance = this
    }
    return _centreInstance
  }

  static getInstance () {
    if (!_centreInstance) {
      _centreInstance = new EventCentre()
    }
    return _centreInstance
  }

  registerCallback (callbackFn) {
    if (isFunction(callbackFn)) {
      this.callbacks = this.callbacks || []
      this.callbacks.push(callbackFn)
    } else {
      throw new Error('EventCentre: given callback is not a function.')
    }
  }

  send (msgType, msg, error) {
    forEach(this.callbacks, (callbackFn) => callbackFn(msgType, msg, error))
  }

  sendError (error) {
    let msg = error
    if (isObject(error) && error) {
      msg = error.trKey || error.message || 'error'
    }
    this.send('error', msg, error)
  }

  sendInfo (infoMsg) {
    this.send('info', infoMsg)
  }

  sendWarning (warningMsg) {
    this.send('warning', warningMsg)
  }

  sendSuccess (successMsg) {
    this.send('success', successMsg)
  }
}

let getErrorByCodeFn
export class CodedError {
  constructor (message, code, trKey) {
    this.name = this.constructor.name
    this.message = message
    this.code = code
    this.trKey = trKey
    if (isFunction(Error.captureStackTrace)) {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = (new Error(message)).stack
    }
  }

  static getErrorByCode (msg, code) {
    return getErrorByCodeFn(msg, code)
  }

  static getErrorFromResponse (response) {
    const msg = response.statusText
    const code = response.status
    let err = CodedError.getErrorByCode(msg, code)
    err.response = response
    return err
  }
}

getErrorByCodeFn = (msg, code) => {
  switch (String(code)) {
    case '400':
    case '401':
    case '403':
    case '404':
    case '500':
      return new CodedError(msg, code, get(trErrorCodes, code, 'app.error.GENERIC'))
    default:
      return new Error(msg + (isEmpty(code) ? '' : `[ERR_${code}]`))
  }
}
