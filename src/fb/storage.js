import firebaseApp from './firebase'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
const storage = getStorage(firebaseApp)

export const uploadImage = async (postId, file) => {
  // ref 함수를 이용해서 Storage 내부 저장할 위치를 지정하고, uploadBytes 함수를 이용해서 파일을 저장합니다.
  const imageRef = ref(storage, `images/posts/${postId}/${uuidv4()}`)
  await uploadBytes(imageRef, file)
  const downloadURL = await getDownloadURL(imageRef)
  return downloadURL
}
