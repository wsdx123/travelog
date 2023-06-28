const SIGNIN = 'SIGN_IN'

export const signInData = (payload) => {
  return {
    type: SIGNIN,
    payload: payload,
  }
}
const initialState = {}

const signIn = (state = initialState, action) => {
  switch (action.type) {
    case SIGNIN:
      return (state = action.payload)
    default:
      return state
  }
}

export default signIn
