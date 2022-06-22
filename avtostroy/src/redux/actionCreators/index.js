import {DELETE_USER, SET_USER} from '../actionTypeConstants'

export const setUserActionCreator = (user) =>{
    return (dispatch) => {
        dispatch({
            type: SET_USER,
            payload: user
        })
    }
}
export const deleteUserActionCreator = () =>{
    return (dispatch) => {
        dispatch({
            type: DELETE_USER
        })
    }
}
