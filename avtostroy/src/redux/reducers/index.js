import {combineReducers} from 'redux'
import userReducer from './userReducer'
import languageReducer from './languageReducer'

const reducers = combineReducers({
    user: userReducer,
    language: languageReducer
})

export default reducers
