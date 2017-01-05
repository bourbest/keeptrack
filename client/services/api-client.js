import { endsWith, isObject } from 'lodash'
import { normalize, denormalize } from './format'
import axios from 'axios'

function checkStatus (response) {
  return response.status >= 200 && response.status < 300
}

function getUrlWithId (url, id) {
  return endsWith(url, '/') ? `${url}${id}` : `${url}/${id}`
}

function handleAxiosError (error) {
  if (error.response) {
    // The request was made, but the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data)
    console.log(error.response.status)
    console.log(error.response.headers)
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message)
  }
  console.log(error.config)
}

function callAxios (config, errorCenter) {
  return axios.request(config)
    .then(res => {
      return res.data
    })
    .catch(handleAxiosError)
}

function serialize (obj) {
  let ret = obj
  if (isObject(obj)) {
    ret = denormalize(obj)
    ret = JSON.stringify(ret)
  }

  return ret
}

function deserialize (json) {
  let obj = JSON.parse(json)
  return normalize(obj)
}

export default class ApiClient {
  constructor (baseConfig) {
    if (!baseConfig.baseURL) {
      throw new Error('baseConfig must have a baseURL defined')
    }

    this.axiosConfig = {
      ...baseConfig,
      checkStatus: checkStatus,
      transformRequest: serialize,
      transformResponse: deserialize,
      withCredentials: true,
      maxRedirects: 0
    }

    this.axiosConfig.headers = this.axiosConfig.headers || {}

    this.setCsrfToken = this.setCsrfToken.bind(this)
    this.get = this.get.bind(this)
    this.put = this.put.bind(this)
    this.post = this.post.bind(this)
    this.patch = this.patch.bind(this)
    this.delete = this.delete.bind(this)
  }

  setCsrfToken (token) {
    this.axiosConfig.headers['X-CSRF-TOKEN'] = token
  }

  get (url, id) {
    if (id) {
      url = getUrlWithId(url, id)
    }

    const config = {...this.axiosConfig, method: 'get', url}
    return callAxios(config)
  }

  put (url, data, id) {
    url = getUrlWithId(url, id)
    const config = {...this.axiosConfig, method: 'put', url, data}
    config.headers['Content-Type'] = 'application/json'
    return callAxios(config)
  }

  patch (url, data, id) {
    url = getUrlWithId(url, id)
    const config = {...this.axiosConfig, method: 'patch', url, data}
    config.headers['Content-Type'] = 'application/json'
    return callAxios(config)
  }

  post (url, data) {
    const config = {...this.axiosConfig, method: 'post', url, data}
    if (isObject(data)) {
      config.headers['Content-Type'] = 'application/json'
    }
    return callAxios(config)
  }

  delete (url, id) {
    url = getUrlWithId(url, id)
    const config = {...this.axiosConfig, method: 'delete', url}
    return callAxios(config)
  }
}
