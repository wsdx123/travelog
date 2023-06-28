import { createStore } from 'redux'
import { combineReducers } from 'redux'
import comments from 'redux/modules/detail'

const rootReducer = combineReducers({
  comments,
})
const store = createStore(rootReducer)

export default store
