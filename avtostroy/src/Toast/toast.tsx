import React, {useEffect, useRef} from 'react'
import {Alert, Box, Collapse, IconButton} from '@mui/material'
import {closeMessage} from '../redux/slices/messageSlice'
import CloseIcon from '@mui/icons-material/Close'
import {useDispatch, useSelector} from 'react-redux'
import {rootStateType} from '../redux/store'

const Toast = () => {
    const dispatch = useDispatch()
    const {message} = useSelector((state: rootStateType) => state.message)
    const timerRef = useRef<ReturnType<typeof setTimeout>>()
    const close = () => {
        dispatch(closeMessage())
    }

    useEffect(() => {
        if (message.text && message.duration) {
            clearTimeout(timerRef.current)
            timerRef.current = setTimeout(() => {
                close()
            }, message.duration)
        }
        return () => {
            clearTimeout(timerRef.current)
        }
        //eslint-disable-next-line
    }, [message])

    return <Box sx={{width: '100%', position: 'fixed', zIndex: 500}}>
        <Collapse in={!!message.text}>
            <Alert
                style={{margin: '0'}}
                severity={message.type}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={close}>
                        <CloseIcon fontSize="inherit"/>
                    </IconButton>
                }
                sx={{mb: 2}}>
                {message.text}
            </Alert>
        </Collapse>
    </Box>
}
export default Toast
