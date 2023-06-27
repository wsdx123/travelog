import { createStore } from 'redux'
import { combineReducers } from 'redux'
import posts from 'modules/post'

const rootReducer = combineReducers({
  posts: posts,
})
const store = createStore(rootReducer)

export default store
