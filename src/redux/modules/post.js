import React from 'react'
import { db } from '../../firebase'
import { doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { getPostsAll } from 'fb/db'

const FILTERPOSTS = 'posts/filter'
const RESET = 'posts/reset'

export const filterPosts = (payload) => {
  return {
    type: FILTERPOSTS,
    payload: payload,
  }
}

export const resetState = () => {
  return {
    type: RESET,
  }
}

// export const loadPosts = async () => {
//   const posts = await getPostsAll()
//   return {
//     type: LOAD_POSTS,
//     payload: posts
//   }
// }
// 기존코드
const initialState = []

getPostsAll().then((postsArray) => {
  initialState.push(...postsArray)
  console.log(postsArray, initialState)
})

// 리듀서
const posts = (state = initialState, action) => {
  switch (action.type) {
    // // (userId !== state.userId) return alert: 권한이 없습니다
    // case 'DELETE_POST':
    //   return state.filter((post) => post.postId !== action.payload)

    // case 'ISLIKED_POST':
    //   return state.map((post) => {
    //     if (post.postId === action.payload) {
    //       return { ...post, isLiked: !post.isLiked }
    //     } else {
    //       return post
    //     }
    //   })
    // case LOADPOSTS:
    //   return [...action.payload]

    case FILTERPOSTS:
      const { period, partner } = action.payload
      if (partner === 'all' && period === 'all') {
        return state
      } else if (partner === 'all') {
        const filteredState = state.filter((el) => el.period === period)
        return (state = filteredState)
      } else if (period === 'all') {
        const filteredState = state.filter((el) => el.partner === partner)
        return (state = filteredState)
      } else {
        const filteredState = state.filter((el) => el.period === period && el.partner === partner)
        return (state = filteredState)
      }
    case RESET:
      return (state = initialState)

    default:
      return state
  }
}

export default posts
