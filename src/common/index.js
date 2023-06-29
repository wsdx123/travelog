export const KB = 1024
export const MB = 1024 ** 2
export const MAX_FILE_SIZE_MB = 5
export const MAX_FILE_LENGTH = 9

export const convertBytesToString = (bytes) => {
  const size_KB = bytes / KB
  const size_MB = bytes / MB

  if (size_MB > 1) return Math.ceil(size_MB * 100) / 100 + 'MB'
  return Math.ceil(size_KB) + 'KB'
}

export const isFileSizeOver = (file) => {
  if (file.size > MAX_FILE_SIZE_MB * MB) return true
  return false
}

export const sliceFiles = (files, start, end) => {
  const newFiles = new DataTransfer()
  Array.from(files)
    .slice(start, end)
    .forEach((file) => newFiles.items.add(file))
  return newFiles.files
}

export const sliceFilesMax = (files) => {
  if (files.length > MAX_FILE_LENGTH) {
    return sliceFiles(files, 0, MAX_FILE_LENGTH)
  }
  return files
}
