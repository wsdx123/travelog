import firebaseApp from '../firebase'
import {
  collection,
  addDoc,
  getFirestore,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
} from 'firebase/firestore'

const db = getFirestore(firebaseApp)

//게시물 생성하기
export const createPost = async (postData) => {
  return await addDoc(collection(db, 'posts'), {
    ...postData,
    createdAt: new Date().getTime(),
  })
}

//게시물 업데이트하기
export const updatePost = async (id, updatedPost) => {
  const postRef = doc(db, 'posts', id)
  return await updateDoc(postRef, updatedPost)
}

//게시물 삭제하기
export const deletePost = async (id) => {
  const postRef = doc(db, 'posts', id)
  return await deleteDoc(postRef)
}

//postId값과 일치하는 게시물 한개 가져오기
export const getPostByPostId = async (postId) => {
  const q = query(collection(db, 'posts'), where('postId', '==', postId))
  const querySnapshot = await getDocs(q)
  const post = []
  querySnapshot.forEach((doc) => {
    post.push({ id: doc.id, ...doc.data() })
  })
  return post[0]
}

//만든 날짜 내림차순(최신순)으로 모든 게시물 가져오기
export const getPostsAll = async () => {
  const postsRef = collection(db, 'posts')
  const q = query(postsRef, orderBy('created_at', 'desc'))
  const querySnapshot = await getDocs(q)
  const posts = []
  querySnapshot.forEach((doc) => {
    posts.push({ id: doc.id, ...doc.data() })
  })
  return posts
}

// 좋아요 상태값 바꾸기
const initialState = []

export const switchHeart = async (state = initialState, action) => {
  switch (action.type) {
    case 'ISLIKED_POST':
      return state.map((post) => {
        if (post.postId === action.payload) {
          return { ...post, isLiked: !post.isLiked }
        } else {
          return post
        }
      })

    default:
      return state
  }
}
