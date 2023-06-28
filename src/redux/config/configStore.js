import { createStore } from 'redux'
import { combineReducers } from 'redux'
import details from 'redux/modules/details'
import posts from 'redux/modules/post'

const rootReducer = combineReducers({
  posts,
  details,
})
const store = createStore(rootReducer)

export default store
