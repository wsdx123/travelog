const initialState = [
  {
    id: 0,
    userId: '레몬퀸',
    place: '제주',
    date: '봄',
    group: '가족',
    review: '역시 제주도는 봄인가봐요 가족여행으로 너무 좋았습니다',
    isLiked: false,
  },
  {
    id: 1,
    userId: '수박보스',
    place: '고창',
    date: '여름',
    group: '친구',
    review: '수박은 고창이죠',
    isLiked: false,
  },
  {
    id: 2,
    userId: '납작복숭아',
    place: '이탈리아',
    date: '여름',
    group: '혼자',
    review: '납작복숭아먹으러 이탈리아 왔는데 역시 매일 맛있습니다 행복해요',
    isLiked: true,
  },
  {
    id: 3,
    userId: '블루키위',
    place: '서울',
    date: '겨울',
    group: '연인',
    review: '서울 구경 즐거워요',
    isLiked: false,
  },
]

// 리듀서
const posts = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_POST':
      return [...state, action.payload]

    //   ***if문 (userId !== state.userId) return alert: 권한이 없습니다
    case 'DELETE_POST':
      return state.filter((post) => post.id !== action.payload)

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
