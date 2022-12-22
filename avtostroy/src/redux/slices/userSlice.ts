import {createSlice} from "@reduxjs/toolkit";
import firebase from 'firebase/compat'

export type userStateType = {
    user: firebase.User | null
}

const initialState: userStateType = {
    user: null
}

const user = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setUser: (state:userStateType, action) => {
            state.user = action.payload
        },
        deleteUser: (state) => {
            state.user = null
        }
    }
})
export default user.reducer

export const {setUser, deleteUser} = user.actions
