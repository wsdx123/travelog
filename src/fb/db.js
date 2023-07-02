import firebaseApp, { auth } from '../firebase'
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
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import { deleteImagesByPostId } from './storage'

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

export const deletePostWithData = async (postId) => {
  console.log('delete: ', postId)
  const postData = await getPostByPostId(postId)
  if (!postData) throw new Error('게시글을 찾을 수 없습니다')
  try {
    await deletePostDoc(postData.id)
  } catch (error) {
    throw new Error('게시글 삭제에 실패했습니다.')
  }
  try {
    await deleteImagesByPostId(postData.postId)
  } catch (error) {
    throw new Error('이미지 삭제에 실패했습니다.')
  }
  try {
    await deleteLikedListDoc(postData.postId)
  } catch (error) {
    throw new Error('좋아요 리스트 삭제에 실패했습니다.')
  }
}

//게시물 삭제하기
const deletePostDoc = async (id) => {
  const postRef = doc(db, 'posts', id)
  return await deleteDoc(postRef)
}
//좋아요 목록 삭제
const deleteLikedListDoc = async (id) => {
  const likedListRef = doc(db, 'likes', id)
  return await deleteDoc(likedListRef)
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
  const q = query(postsRef, orderBy('createdAt', 'desc'))
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

export const heartHandler = async (heart, postId) => {
  if (!heart) {
    const heartRef = doc(db, 'likes', postId)
    await updateDoc(heartRef, {
      likedList: arrayUnion(auth.currentUser.uid),
    })
  } else {
    const heartRef = doc(db, 'likes', postId)
    await updateDoc(heartRef, {
      likedList: arrayRemove(auth.currentUser.uid),
    })
  }
}
