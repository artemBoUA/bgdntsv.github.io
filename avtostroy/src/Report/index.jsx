import React, {useEffect, useState} from 'react'
import {appCheck} from '../firebaseHelper'
import {getDatabase, ref, set} from 'firebase/database'
import {
    Alert, Box, Button,
    CircularProgress,
    Collapse,
    FormControl,
    Grid,
    IconButton,
    Input,
    InputLabel
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'

export const Report = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [organization, setOrganization] = useState('')
    const [organizationTouched, setOrganizationTouched] = useState(false)
    const [workType, setWorkType] = useState('')
    const [workTypeTouched, setWorkTypeTouched] = useState(false)
    const [workObject, setWorkObject] = useState('')
    const [workObjectTouched, setWorkObjectTouched] = useState(false)
    const [location, setLocation] = useState('')
    const [messageText, setMessageText] = useState('')
    const [isMessageOpen, setIsMessageOpen] = useState(false)
    const [messageType, setMessageType] = useState('success')
    const navigate = useNavigate()
    const {user} = useSelector(state => state.user)

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    }, [user, navigate])

    const sendData = async (e) => {
        e.preventDefault()
        if (!organization || !workType || !workObject) {
            setMessageText('All fields must be filled')
            setIsMessageOpen(true)
            setMessageType('warning')
            setOrganizationTouched(true)
            setWorkTypeTouched(true)
            setWorkObjectTouched(true)
            setTimeout(closeMessage, 3000)
            return
        }
        setIsLoading(true)
        const db = getDatabase()
        const date = new Date()
        await appCheck()
        set(ref(db, 'reports/'+ user.uid + '/' + date.toLocaleDateString().replaceAll('/', '_')
            + '/' + Date.now().toString()), {
            organization: organization,
            workType: workType,
            workObject: workObject,
            owner: user.email,
            timeCreation: new Date().toTimeString().split(' ')[0]
        }).then(() => {
            setMessageType('success')
            setIsMessageOpen(true)
            setMessageText('Data saved')
            getInitialState()
            setTimeout(closeMessage, 3000)
        }).catch((error) => {
            setIsMessageOpen(true)
            setMessageText(error.message)
            setMessageType('error')
        }).finally(() => {
            setIsLoading(false)
        })
    }
    const getInitialState = () => {
        setOrganization('')
        setWorkObject('')
        setWorkType('')
        setLocation('')
        setOrganizationTouched(false)
        setWorkObjectTouched(false)
        setWorkTypeTouched(false)
    }
    const closeMessage = () => {
        setMessageText('')
        setMessageType('success')
        setIsMessageOpen(false)
    }
    return <>
        <Collapse in={isMessageOpen} sx={{padding: '.5rem .5rem 0'}}>
            <Alert
                severity={messageType}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={closeMessage}>
                        <CloseIcon fontSize="inherit"/>
                    </IconButton>
                }
                sx={{mb: 2}}>
                {messageText}
            </Alert>
        </Collapse>

        <form onSubmit={sendData}>
            <Grid container spacing={3} justifyContent="center" alignItems="center">
                <Grid item sm={10} md={6}>

                </Grid>
                <Grid item sm={10} md={5}>
                    <FormControl error={organizationTouched && !organization} sx={{padding: '1rem', width: '95%'}}>
                        <InputLabel htmlFor="organization" sx={{top: 'auto'}}>Organization</InputLabel>
                        <Input id="organization" value={organization} onBlur={() => setOrganizationTouched(true)}
                               onChange={(e) => setOrganization(e.target.value)} aria-describedby="organization name"/>
                    </FormControl>
                    <FormControl error={workTypeTouched && !workType} sx={{padding: '1rem', width: '95%'}}>
                        <InputLabel htmlFor="workType" sx={{top: 'auto'}}>Type of work</InputLabel>
                        <Input id="workType" value={workType} onBlur={() => setWorkTypeTouched(true)}
                               onChange={(e) => setWorkType(e.target.value)} aria-describedby="type of work"/>
                    </FormControl>
                    <FormControl error={workObjectTouched && !workObject} sx={{padding: '1rem', width: '95%'}}>
                        <InputLabel htmlFor="workObject" sx={{top: 'auto'}}>Object of work</InputLabel>
                        <Input id="workObject" value={workObject} onBlur={() => setWorkObjectTouched(true)}
                               onChange={(e) => setWorkObject(e.target.value)} aria-describedby="object of work"/>
                    </FormControl>

                    <Box sx={{m: '1rem 1rem 1rem auto', position: 'relative', width: 'fit-content'}}>
                        <Button variant="contained" disabled={isLoading} type="submit">Send data</Button>
                        {isLoading && <CircularProgress
                            size={24}
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                right: '50%',
                                marginTop: '-12px',
                                marginRight: '-12px'
                            }}
                        />}
                    </Box>
                </Grid>
            </Grid>
        </form>
    </>
}
