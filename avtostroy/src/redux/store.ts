import user from './slices/userSlice'
import message from './slices/messageSlice'
import {configureStore} from '@reduxjs/toolkit'

const store = configureStore({
    reducer: {
        user,
        message
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
})

export type rootStateType = ReturnType<typeof store.getState>
export default store
