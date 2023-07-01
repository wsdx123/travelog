import React from 'react'
import { db } from '../../firebase'
import { doc, deleteDoc, updateDoc } from 'firebase/firestore'

// 기존코드
const initialState = []

// 리듀서
const posts = (state = initialState, action) => {
  switch (action.type) {
    // (userId !== state.userId) return alert: 권한이 없습니다
    case 'DELETE_POST':
      return state.filter((post) => post.postId !== action.payload)

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

export default posts
