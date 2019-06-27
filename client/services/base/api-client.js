import { endsWith, isObject, isArray } from 'lodash'
import axios from 'axios'

function checkStatus (response) {
  return response.status >= 200 && response.status < 300
}

function getUrlWithId (url, id) {
  if (id) {
    return endsWith(url, '/') ? `${url}${id}` : `${url}/${id}`
  }
  return url
}

/*
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
  throw error
}
*/
function callAxios (config, errorCenter) {
  return axios.request(config)
    .then(res => {
      return res.data
    })
//    .catch(handleAxiosError)
}

function serialize (obj) {
  let ret = obj
  if (isObject(obj) && !(obj instanceof FormData)) {
    ret = JSON.stringify(ret)
  }

  return ret
}

function deserialize (json) {
  if (!json || json === '') {
    return null
  }

  return JSON.parse(json)
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
    this.putFile = this.putFile.bind(this)
  }

  setCsrfToken (token) {
    this.axiosConfig.headers['X-CSRF-TOKEN'] = token
  }

  get (url, id, callHeaders, params) {
    if (id) {
      url = getUrlWithId(url, id)
    }
    const config = {...this.axiosConfig, method: 'get', url}
    if (callHeaders) {
      config.headers = {...config.headers, ...callHeaders}
    }
    if (params) {
      config.params = params
    }
    return callAxios(config)
  }

  put (url, data, id, callHeaders) {
    if (id) {
      url = getUrlWithId(url, id)
    }
    const config = {...this.axiosConfig, method: 'put', url, data}
    config.headers['Content-Type'] = 'application/json'
    return callAxios(config)
  }

  patch (url, data, id, callHeaders) {
    url = getUrlWithId(url, id)
    const config = {...this.axiosConfig, method: 'patch', url, data}
    config.headers['Content-Type'] = 'application/json'
    return callAxios(config)
  }

  post (url, data, callHeaders) {
    const config = {...this.axiosConfig, method: 'post', url, data}
    if (isObject(data)) {
      config.headers['Content-Type'] = 'application/json'
    }
    if (callHeaders) {
      config.headers = {...config.headers, ...callHeaders}
    }
    return callAxios(config)
  }

  delete (url, ids, callHeaders) {
    const config = {...this.axiosConfig, method: 'delete'}
    if (isArray(ids)) {
      config.url = url
      config.data = JSON.stringify(ids)
      config.headers['Content-Type'] = 'application/json'
    } else {
      config.url = getUrlWithId(url, ids)
    }
    if (callHeaders) {
      config.headers = {...config.headers, ...callHeaders}
    }
    return callAxios(config)
  }

  putFile (url, filePointer, onProgressCallback) {
    const formData = new FormData()
    formData.append('file', filePointer)

    const config = {
      ...this.axiosConfig,
      method: 'put',
      url,
      data: formData,
      transformRequest: null,
      onUploadProgress: onProgressCallback
    }
    config.headers['Content-Type'] = 'multipart/form-data'
    return callAxios(config)
  }
}
