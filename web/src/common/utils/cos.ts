import type { UploadRequestOption, UploadRequestError, UploadProgressEvent } from 'rc-upload/lib/interface'

export function getFileType(fileKey: string): string {
  if (!fileKey) return undefined
  const extName = fileKey.replace(/(^.*\.)|(\?.*$)/, '').toLowerCase()
  return {
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    gif: 'image',
    pdf: 'pdf',
  }[extName]
}

export function isPreviewSupported(fileKey: string): boolean {
  return Boolean(getFileType(fileKey))
}

function getError(option: UploadRequestOption, xhr: XMLHttpRequest) {
  const msg = `cannot ${option.method} ${option.action} ${xhr.status}`
  const err = new Error(msg) as UploadRequestError
  err.status = xhr.status
  err.method = option.method
  err.url = option.action
  return err
}

function getBody(xhr: XMLHttpRequest) {
  const text = xhr.responseText || xhr.response
  if (!text) return text
  try {
    return JSON.parse(text)
    // eslint-disable-next-line unicorn/prefer-optional-catch-binding
  } catch (error) {
    return text
  }
}

// 参考 https://github.com/react-component/upload/blob/master/src/request.ts
export function upload(option: UploadRequestOption): { abort: () => void } {
  const { headers = {}, data = {}, method = 'POST', action, file, filename, withCredentials, onProgress, onError, onSuccess } = option
  const xhr = new XMLHttpRequest()

  const formData = new FormData()

  Object.keys(data).forEach((key) => {
    const value = data[key]
    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(`${key}[]`, item) // { list: [ 11, 22 ] } => formData.append('list[]', 11);
      })
      return
    }
    formData.append(key, data[key])
  })

  if (file instanceof Blob) {
    formData.append(filename || 'file', file, file.name)
  } else {
    formData.append(filename || 'file', file)
  }

  if (onProgress && xhr.upload) {
    xhr.upload.addEventListener('progress', (event: UploadProgressEvent) => {
      if (event.total > 0) {
        event.percent = (event.loaded / event.total) * 100
      }
      onProgress(event)
    })
  }
  if (onError) {
    xhr.addEventListener('error', (event) => {
      onError(event)
    })
  }
  if (onSuccess) {
    xhr.addEventListener('load', () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        return onError && onError(getError(option, xhr), getBody(xhr))
      }
      return onSuccess(getBody(xhr), xhr)
    })
  }

  if (withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true
  }

  xhr.open(method, action, true)

  if (headers['X-Requested-With'] !== null) {
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
  }

  Object.keys(headers).forEach((header) => {
    if (headers[header] !== null) {
      xhr.setRequestHeader(header, headers[header])
    }
  })
  xhr.send(formData)

  return {
    abort() {
      xhr.abort()
    },
  }
}
