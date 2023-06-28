import firebaseApp from '../firebase'
import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytes } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
const storage = getStorage(firebaseApp)

export const uploadImage = async (postId, file) => {
  // ref 함수를 이용해서 Storage 내부 저장할 위치를 지정하고, uploadBytes 함수를 이용해서 파일을 저장합니다.
  const imageRef = ref(storage, `images/posts/${postId}/${uuidv4()}`)
  await uploadBytes(imageRef, file)
  const downloadURL = await getDownloadURL(imageRef)
  return downloadURL
}

export const uploadImages = async (postId, files) => {
  const downloadUrls = []
  for (let i = 0; i < files.length; i++) {
    const imageRef = ref(storage, `images/posts/${postId}/${uuidv4()}`)
    await uploadBytes(imageRef, files.item(i))
    const downloadURL = await getDownloadURL(imageRef)
    downloadUrls.push(downloadURL)
  }
  return downloadUrls
}

export const deleteImage = async (postId) => await deleteFolder(`images/posts/${postId}`)

const deleteFile = async (path) => {
  const deleteItemRef = ref(storage, path)
  return await deleteObject(deleteItemRef)
}

const deleteFolder = async (path) => {
  const listRef = ref(storage, path)
  listAll(listRef)
    .then((res) => {
      // res.prefixes.forEach((folderRef) => {
      // });
      res.items.forEach((itemRef) => {
        deleteFile(itemRef.fullPath)
      })
    })
    .catch((error) => {
      console.error(error)
    })
}
