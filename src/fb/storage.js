import firebaseApp from '../firebase'
import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytesResumable } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
export const storage = getStorage(firebaseApp)

export const uploadImage = async (postId, file, onProgress) => {
  // ref 함수를 이용해서 Storage 내부 저장할 위치를 지정하고, uploadBytes 함수를 이용해서 파일을 저장합니다.
  return new Promise((resolve, reject) => {
    const imageRef = ref(storage, `images/posts/${postId}/${uuidv4()}`)
    //await uploadBytes(imageRef, file)
    const uploadTask = uploadBytesResumable(imageRef, file)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        // console.log('Upload is ' + progress + '% done')
        onProgress(progress)
        switch (snapshot.state) {
          case 'paused':
            //console.log('Upload is paused')
            break
          case 'running':
            //console.log('Upload is running')
            break
          default:
        }
      },
      (error) => {
        reject(error)
      },
      () => {
        onProgress(100)
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          //console.log('File available at', downloadURL)
          resolve(downloadURL)
        })
      }
    )
  })
  // const downloadURL = await getDownloadURL(imageRef)
  // return downloadURL
}

export const uploadImages = async (postId, files) => {
  const downloadUrls = []
  for (let i = 0; i < files.length; i++) {
    const url = await uploadImage(postId, files[i])
    downloadUrls.push(url)
  }
  //console.log(downloadUrls)
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
      //console.error(error)
    })
}
