import React, {useState} from 'react'
import {appCheck} from '../utils/firebaseHelper'
import {getDatabase, ref, set} from 'firebase/database'
import * as firebaseStorage from 'firebase/storage'
import {Box, Button, CircularProgress, FormControl, Grid, IconButton, ImageList, ImageListItem, Input, InputLabel} from '@mui/material'
import Map from '../googleMaps/map'
import AddAPhotoRoundedIcon from '@mui/icons-material/AddAPhotoRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import Compressor from 'compressorjs'
import {useDispatch} from 'react-redux'
import {setMessage} from '../redux/slices/messageSlice'
import {getErrorMessage} from '../utils/utils'
import {useTranslation} from 'react-i18next'
import firebase from 'firebase/compat'

const Report = ({user}: {user: firebase.User}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [organization, setOrganization] = useState('')
    const [organizationTouched, setOrganizationTouched] = useState(false)
    const [workType, setWorkType] = useState('')
    const [workTypeTouched, setWorkTypeTouched] = useState(false)
    const [workObject, setWorkObject] = useState('')
    const [workObjectTouched, setWorkObjectTouched] = useState(false)
    const [workVolume, setWorkVolume] = useState('')
    const [workVolumeTouched, setWorkVolumeTouched] = useState(false)
    const [locations, setLocations] = useState<Array<google.maps.LatLngLiteral>>([])
    const [images, setImages] = useState<Array<Blob>>([])
    const dispatch = useDispatch()
    const {t} = useTranslation()

    const getInitialState = () => {
        setOrganization('')
        setWorkObject('')
        setWorkType('')
        setImages([])
        setLocations([])
        setWorkVolume('')
        setOrganizationTouched(false)
        setWorkObjectTouched(false)
        setWorkTypeTouched(false)
        setWorkVolumeTouched(false)
    }

    const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!organization || !workType || !workObject || !locations[0]) {
            const error = t('ALL_FIELDS_MUST_BE_FILED')
            dispatch(setMessage({text: error, type: 'warning'}))
            setOrganizationTouched(true)
            setWorkTypeTouched(true)
            setWorkObjectTouched(true)
            setWorkVolumeTouched(true)
            return
        }
        setIsLoading(true)
        const date = new Date()
        const reportUrl = `${user.uid}/${date.toLocaleDateString().replaceAll('/', '_')
            .replaceAll('.', '_')}/${Date.now().toString()}`
        const db = getDatabase()
        await appCheck()
        if (images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                const storage = firebaseStorage.getStorage()
                const storageRef = firebaseStorage.ref(storage, `images/${reportUrl}/${images[i].name}`)
                try {
                    await firebaseStorage.uploadBytes(storageRef, images[i])
                } catch (e) {
                    dispatch(setMessage({text: getErrorMessage(e) + '\nCan\'t upload image.', type: 'error'}))
                    setIsLoading(false)
                    return
                }
            }
        }
        try {
            await set(ref(db, `reports/${reportUrl}`), {
                organization,
                workType,
                workObject,
                workVolume,
                locations,
                owner: `${user.displayName} ${user.email}`,
                timeCreation: new Date().toTimeString().split(' ')[0]
            })
            dispatch(setMessage({text: 'Data saved', type: 'success'}))
            getInitialState()
        } catch (e) {
            dispatch(setMessage({text: getErrorMessage(e), type: 'error'}))
        } finally {
            setIsLoading(false)
        }
    }

    const addImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.files) {
            for (let i = 0; i < e.currentTarget.files.length; i++) {
                new Compressor(e.currentTarget.files[i], {
                    quality: 0.8,
                    maxWidth: 700,
                    maxHeight: 700,
                    success: (compressedResult) => {
                        setImages(prev => [...prev, compressedResult])
                    }
                })
            }
        }
    }

    return <>
        <form onSubmit={sendData} style={{paddingTop: '1rem'}}>
            <Grid container spacing={3} justifyContent="center" alignItems="center">
                <Grid item sm={10} md={6} sx={{height: '100%'}}>
                    <Map markers={locations} setMarkers={setLocations}/>
                </Grid>
                <Grid item sm={10} md={5}>
                    <FormControl error={organizationTouched && !organization} sx={{padding: '1rem', width: '95%'}}>
                        <InputLabel htmlFor="organization"
                                    sx={{top: 'auto'}}>{t('ORGANIZATION')}*</InputLabel>
                        <Input id="organization" value={organization} onBlur={() => setOrganizationTouched(true)}
                               onChange={(e) => setOrganization(e.target.value)} aria-describedby="organization name"/>
                    </FormControl>
                    <FormControl error={workTypeTouched && !workType} sx={{padding: '1rem', width: '95%'}}>
                        <InputLabel htmlFor="workType"
                                    sx={{top: 'auto'}}>{t('TYPE_OF_WORK')}*</InputLabel>
                        <Input id="workType" value={workType} onBlur={() => setWorkTypeTouched(true)}
                               onChange={(e) => setWorkType(e.target.value)} aria-describedby="type of work"/>
                    </FormControl>
                    <FormControl error={workObjectTouched && !workObject} sx={{padding: '1rem', width: '95%'}}>
                        <InputLabel htmlFor="workObject"
                                    sx={{top: 'auto'}}>{t('OBJECT_OF_WORK')}*</InputLabel>
                        <Input id="workObject" value={workObject} onBlur={() => setWorkObjectTouched(true)}
                               onChange={(e) => setWorkObject(e.target.value)} aria-describedby="object of work"/>
                    </FormControl>
                    <FormControl error={workVolumeTouched && !workVolume} sx={{padding: '1rem', width: '95%'}}>
                        <InputLabel htmlFor="workVolume"
                                    sx={{top: 'auto'}}>{t('VOLUME_OF_WORK')}*</InputLabel>
                        <Input id="workVolume" value={workVolume} onBlur={() => setWorkVolumeTouched(true)}
                               onChange={(e) => setWorkVolume(e.target.value)} aria-describedby="volume of work"/>
                    </FormControl>
                    {images.length > 0 &&
                        <ImageList
                            sx={{width: '100%', height: 'fit-content', p: window.innerWidth > 900 ? '0' : '0 1rem'}}
                            cols={window.innerWidth > 900 ? 2 : 1}>
                            {images.map((item, i) => (
                                <ImageListItem key={i}
                                               sx={{width: window.innerWidth < 900 ? 'calc(100% - 2rem)' : '100%'}}>
                                    <img src={URL.createObjectURL(item)} alt={'selected image ' + i}/>
                                </ImageListItem>
                            ))}
                        </ImageList>}
                    <Box sx={{m: '1rem', position: 'relative', display: 'flex', justifyContent: 'space-between'}}>
                        <Box>
                            <label htmlFor="contained-button-file">
                                <input accept="image/*" id="contained-button-file" multiple type="file"
                                       style={{display: 'none'}} onChange={addImages}/>
                                <Button size="medium" variant="contained" component="span" disabled={isLoading}
                                        endIcon={<AddAPhotoRoundedIcon/>}>
                                    {t('ADD_PHOTOS')}
                                </Button>
                            </label>
                            {images.length > 0 && <IconButton disabled={isLoading} onClick={() => setImages([])}>
                                <CloseRoundedIcon/>
                            </IconButton>}
                        </Box>
                        <Button variant="contained" size="medium" disabled={isLoading}
                                type="submit">{t('SEND_DATA')}</Button>
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
export default React.memo(Report)
