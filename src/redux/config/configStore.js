import { createStore } from 'redux'
import { combineReducers } from 'redux'
import details from 'redux/modules/details'
import posts from 'redux/modules/post'
import signIn from 'redux/modules/signIn'

const rootReducer = combineReducers({
  posts,
  details,
  signIn,
})
const store = createStore(rootReducer)

export default store
