import uuid from 'react-uuid'

const initialState = [
  {
    id: uuid(),
    comments: 'test comments1',
    editMode: false, // false: 수정X true:수정하기
  },
  {
    id: uuid(),
    comments: 'test comments2',
    editMode: false, // false: 수정X true:수정하기
  },
  {
    id: uuid(),
    comments: 'test comments3',
    editMode: false, // false: 수정X true:수정하기
  },
]

const details = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_COMMENTS':
      if (action.payload) {
        return [
          ...state,
          {
            id: uuid(),
            comments: action.payload,
            editMode: false,
          },
        ]
      } else {
        alert('댓글을 입력해 주세요.')
      }
      break
    case 'DELETE_COMMENTS':
      return [
        ...state.filter((item) => {
          return item.id !== action.payload.id
        }),
      ]
    case 'EDIT_MODE':
      return [
        ...state.map((item) => {
          if (item.id === action.payload.id) {
            return { ...item, editMode: !action.payload.editMode }
          } else {
            return item
          }
        }),
      ]

    default:
      return state
  }
}

export default details
