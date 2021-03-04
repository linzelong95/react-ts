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
