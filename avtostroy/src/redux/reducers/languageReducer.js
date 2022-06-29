import {SET_LANGUAGE} from '../actionTypeConstants'
const initialState = {
    language: 'ua'
}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LANGUAGE:
            return {...state, language: action.payload}
        default:
            return state
    }
}
export default reducer
