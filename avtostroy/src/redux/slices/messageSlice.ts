import {createSlice, PayloadAction} from '@reduxjs/toolkit'

type alertType = 'error' | 'warning' | 'info' | 'success'

export type messageStateType = {
    message: {
        text: string
        type: alertType
        duration: number
    }
}

const initialState: messageStateType = {
    message: {
        text: '',
        type: 'success',
        duration: 5000
    }
}

type payloadType = {
    text: string
    type?: alertType,
    duration?: number
}

const message = createSlice({
    initialState: initialState,
    name: 'message',
    reducers: {
        setMessage: (state: messageStateType, action: PayloadAction<payloadType>) => {
            state.message = {...state.message, ...action.payload}
        },
        closeMessage: (state: messageStateType) => {
            state.message = {...state.message, text: '', duration: initialState.message.duration}
        }
    }
})
export default message.reducer

export const {setMessage, closeMessage} = message.actions
