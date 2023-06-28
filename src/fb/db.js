import firebaseApp from '../firebase'
import { collection, addDoc, getFirestore, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'

const db = getFirestore(firebaseApp)

export const createPost = async (postData) => {
  return await addDoc(collection(db, 'posts'), {
    ...postData,
    created_at: new Date().getTime(),
  })
}

export const updatePost = async (id, updatedPost) => {
  const postRef = doc(db, 'posts', id)
  return await updateDoc(postRef, updatedPost)
}

export const deletePost = async (id) => {
  const postRef = doc(db, 'posts', id)
  return await deleteDoc(postRef)
}

export const getPostByPostId = async (postId) => {
  const q = query(collection(db, 'posts'), where('postId', '==', postId))
  const querySnapshot = await getDocs(q)
  const post = []
  querySnapshot.forEach((doc) => {
    post.push({ id: doc.id, ...doc.data() })
  })
  return post[0]
}
