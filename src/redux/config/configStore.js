import { createStore } from 'redux'
import { combineReducers } from 'redux'
import comments from 'redux/modules/detail'
import posts from 'modules/post'

const rootReducer = combineReducers({
  posts: posts, comments,

})
const store = createStore(rootReducer)

export default store
