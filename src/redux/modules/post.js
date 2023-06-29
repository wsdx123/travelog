import { db } from '../../firebase'

const initialState = db
console.log(initialState)

// 리듀서
const posts = (state = initialState, action) => {
  switch (action.type) {
    // case 'ADD_POST':
    //   return [...state, action.payload]

    //   ***if문 (userId !== state.userId) return alert: 권한이 없습니다
    case 'DELETE_POST':
      return state.filter((post) => post.postId !== action.payload)

    case 'ISLIKED_POST':
      return state.map((post) => {
        if (post.id === action.payload) {
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
