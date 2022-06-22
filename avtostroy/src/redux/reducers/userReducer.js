import {DELETE_USER, SET_USER} from '../actionTypeConstants'

const reducer = (state={}, action) => {
    switch (action.type){
        case SET_USER:
            return {...state, user: action.payload}
        case DELETE_USER:
            return {...state, user: null}
        default:
            return state
    }
}

export default reducer
