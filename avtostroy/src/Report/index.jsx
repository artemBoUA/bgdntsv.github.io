import React, {useState} from 'react'
import {appCheck} from '../firebaseHelper'
import {getDatabase, ref, set} from 'firebase/database'
import * as firebaseStorage from 'firebase/storage'
import {
    Alert,
    Box, Button,
    CircularProgress, Collapse,
    FormControl,
    Grid, IconButton, ImageList, ImageListItem,
    Input,
    InputLabel
} from '@mui/material'
import {Map} from '../googleMaps/Map'
import CloseIcon from '@mui/icons-material/Close'
import AddAPhotoRoundedIcon from '@mui/icons-material/AddAPhotoRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import Compressor from 'compressorjs'

export const Report = ({user}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [organization, setOrganization] = useState('')
    const [organizationTouched, setOrganizationTouched] = useState(false)
    const [workType, setWorkType] = useState('')
    const [workTypeTouched, setWorkTypeTouched] = useState(false)
    const [workObject, setWorkObject] = useState('')
    const [workObjectTouched, setWorkObjectTouched] = useState(false)
    const [locations, setLocations] = useState([])
    const [messageText, setMessageText] = useState('')
    const [isMessageOpen, setIsMessageOpen] = useState(false)
    const [messageType, setMessageType] = useState('success')
    const [images, setImages] = useState([])

    const sendData = async (e) => {
        e.preventDefault()
        if (!organization || !workType || !workObject || !locations[0]) {
            setMessageText('All fields must be filled and at least one location should be chosen')
            setIsMessageOpen(true)
            setMessageType('warning')
            setOrganizationTouched(true)
            setWorkTypeTouched(true)
            setWorkObjectTouched(true)
            setTimeout(closeMessage, 3000)
            return
        }
        setIsLoading(true)
        const date = new Date()
        const reportUrl = `${user.uid}/${date.toLocaleDateString().replaceAll('/', '_')}/${Date.now().toString()}`
        const db = getDatabase()
        await appCheck()
        const imageURLs = []
        if (images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                const storage = firebaseStorage.getStorage()
                const storageRef = firebaseStorage.ref(storage, `images/${reportUrl}/${images[i].name}`)
                try{
                    const res = await firebaseStorage.uploadBytes(storageRef, images[i])
                    imageURLs.push(res.metadata.fullPath)
                }catch (e){
                    setIsMessageOpen(true)
                    setMessageText(e.message+' Can\'t upload image.')
                    setMessageType('error')
                    setTimeout(closeMessage, 3000)
                    setIsLoading(false)
                    return
                }
            }
        }
        set(ref(db, `reports/${reportUrl}`), {
            organization,
            workType,
            workObject,
            locations,
            images: imageURLs,
            owner: user.email,
            timeCreation: new Date().toTimeString().split(' ')[0]
        }).then(() => {
            setMessageType('success')
            setIsMessageOpen(true)
            setMessageText('Data saved')
            setTimeout(closeMessage, 3000)
            getInitialState()
        }).catch((error) => {
            setIsMessageOpen(true)
            setMessageText(error.message)
            setMessageType('error')
            setTimeout(closeMessage, 3000)
        }).finally(() => {
            setIsLoading(false)
        })
    }
    const getInitialState = () => {
        setOrganization('')
        setWorkObject('')
        setWorkType('')
        setImages([])
        setLocations([])
        setOrganizationTouched(false)
        setWorkObjectTouched(false)
        setWorkTypeTouched(false)
    }

    const closeMessage = () => {
        setMessageText('')
        setMessageType('success')
        setIsMessageOpen(false)
    }

    const addImages = (e) => {
        for (let i = 0; i < e.target.files.length; i++) {
            new Compressor(e.target.files[i], {
                quality: 0.8,
                maxWidth: 700,
                maxHeight: 700,
                success: (compressedResult) => {
                    setImages(prev => [...prev, compressedResult])
                }
            })
        }
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
                <Grid item sm={10} md={6} sx={{height: '100%'}}>
                    <Map setMessageText={setMessageText} setMessageType={setMessageType}
                         setIsMessageOpen={setIsMessageOpen} markers={locations} setMarkers={setLocations}/>
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
                    {images.length > 0 &&
                        <ImageList sx={{width: '100%', height: 'fit-content', p: window.innerWidth>900?'0':'0 1rem'}} cols={2}>
                            {images.map((item, i) => (
                                <ImageListItem key={i}>
                                    <img src={URL.createObjectURL(item)} alt={'selected image ' + i}/>
                                </ImageListItem>
                            ))}
                        </ImageList>}
                    <Box sx={{m: '1rem', position: 'relative', display: 'flex', justifyContent: 'space-between'}}>
                        <Box>
                            <label htmlFor="contained-button-file">
                                <input accept="image/*" id="contained-button-file" multiple type="file"
                                       style={{display: 'none'}} onChange={addImages}/>
                                <Button size="large" variant="contained" component="span" disabled={isLoading}
                                        endIcon={<AddAPhotoRoundedIcon/>}>
                                    Add images
                                </Button>
                            </label>
                            {images.length>0&&<IconButton disabled={isLoading} onClick={() => setImages([])}>
                                <CloseRoundedIcon/>
                            </IconButton>}
                        </Box>
                        <Button variant="contained" size="large" disabled={isLoading} type="submit">Send data</Button>
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
