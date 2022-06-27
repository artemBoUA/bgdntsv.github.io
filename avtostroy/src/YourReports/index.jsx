import React, {useEffect, useRef, useState, useCallback} from 'react'
import {child, get, getDatabase, ref} from 'firebase/database'
import {appCheck} from '../firebaseHelper'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    CircularProgress, Grid, ImageList, ImageListItem,
    Typography
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {lightBlue, blue} from '@mui/material/colors'
import FolderIcon from '@mui/icons-material/Folder'
import ReplayIcon from '@mui/icons-material/Replay'
import {GoogleMap, Marker} from '@react-google-maps/api'
import mapStyles from '../googleMaps/mapsStyles'
import * as firebaseStorage from 'firebase/storage'

export const YourReports = ({user}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [images, setImages] = useState([])
    const [snapshot, setSnapshot] = useState()
    const mapRef = useRef()
    const options = {
        disableDefaultUI: true,
        styles: mapStyles,
        zoomControl: true,
        fullscreenControl: true
    }
    const onMapLoad = useCallback(
        (map) => {
            mapRef.current = map
        },
        []
    )
    const MapComponent = ({locations}) => {
        return <GoogleMap mapContainerStyle={{width: '100%', minHeight: '100%', height: '400px'}}
                          zoom={14}
                          options={options}
                          center={locations[0]}
                          onLoad={onMapLoad}>
            {locations.map((marker, i) => <Marker key={i}
                                                  position={{lat: marker.lat, lng: marker.lng}}
                                                  icon={{
                                                      url: '/markerImg.svg',
                                                      scaledSize: new window.google.maps.Size(25, 25),
                                                      origin: new window.google.maps.Point(0, 0),
                                                      anchor: new window.google.maps.Point(15, 15)
                                                  }}
            />)}
        </GoogleMap>
    }
    const getImageURLs = async (dateRep, report) => {
        let imageURLs = []
        const reportInt = parseInt(report)
        if(!images[reportInt]) {
            const storage = firebaseStorage.getStorage()
            const imageListRef = firebaseStorage.ref(storage, `images/${user.uid}/${dateRep}/${report}`)
            const res = await firebaseStorage.listAll(imageListRef)
            for (const item of res.items) {
                const url = await firebaseStorage.getDownloadURL(item)
                imageURLs = [...imageURLs, url]
            }
            setImages(prev=>{return{...prev, [reportInt]: imageURLs}})
        }
    }
    const getDataFirebase = async () => {
        setIsLoading(true)
        const dbRef = ref(getDatabase())
        await appCheck()
        const resSnapshot = await get(child(dbRef, 'reports/' + user.uid))
        if (resSnapshot?.exists()) {
            const responseData = resSnapshot.val()
            for (const key in responseData) {
                for (const keyKey in responseData[key]) {
                    await getImageURLs(key, keyKey)
                }
            }
        }
        setSnapshot(resSnapshot)
        setIsLoading(false)
    }
    const ImagesComponent = ({report}) => {
        return images[report] ? images[report].length > 0 ?
                <ImageList sx={{width: '100%', height: 'fit-content'}} cols={1}>
                    {images[report].map((item, i) => (
                        <ImageListItem key={i}
                                       sx={{p: window.innerWidth > 900 ? '.5rem 1rem' : '0 .5rem'}}>
                            <img src={item} alt={'selected image ' + i} loading="lazy"/>
                        </ImageListItem>
                    ))}
                </ImageList>
                : <></>
            : <></>
    }
    const getContent = () => {
        if (snapshot?.exists()) {
            const responseData = snapshot.val()
            return Object.keys(responseData).reverse().map((dateRep, i) => {
                const reports = Object.keys(responseData[dateRep]).map((report, index) => {
                    const reportObject = responseData[dateRep][report]
                    return <Accordion key={index}
                                      sx={{backgroundColor: lightBlue[100], border: '1px solid' + lightBlue[200]}}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls={`panel${index}-content`}
                            id={`panel${index}-header`}>
                            <Typography sx={{display: 'flex'}}>
                                <FolderIcon sx={{marginRight: '1rem'}} color="primary"/>
                                {reportObject.timeCreation}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{backgroundColor: lightBlue[50]}}>
                            <Grid container>
                                <Grid item xs={12} md={7}>
                                    {images[report] && <MapComponent locations={reportObject.locations}/>}
                                </Grid>
                                <Grid item xs={12} md={5}
                                      sx={{
                                          p: window.innerWidth > 900 ? '1rem' : '0',
                                          display: 'flex',
                                          justifyContent: 'center',
                                          flexDirection: 'column'
                                      }}>
                                    <Typography variant="h6"
                                                sx={{p: '1rem 0'}}>Organization: {reportObject.organization}</Typography>
                                    <Typography variant="h6" sx={{p: '1rem 0'}}>Object of
                                        work: {reportObject.workObject}</Typography>
                                    <Typography variant="h6" sx={{p: '1rem 0'}}>Type of
                                        work: {reportObject.workType}</Typography>
                                    <ImagesComponent report={report}/>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                })
                return <Accordion key={i} sx={{backgroundColor: blue[50], border: '1px solid' + lightBlue[100]}}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls={`panel${i}-content`}
                        id={`panel${i}-header`}>
                        <Typography sx={{display: 'flex'}}>
                            <FolderIcon sx={{marginRight: '1rem'}} color="primary"/>
                            {dateRep.replaceAll('_', '/')}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {reports}
                    </AccordionDetails>
                </Accordion>
            })
        } else {
            return <h3>No data available</h3>
        }
    }

    useEffect(() => {
        getDataFirebase()
        // eslint-disable-next-line
    }, [])

    return <>
        <Box sx={{display: 'flex', padding: '1rem'}} justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1">Your reports</Typography>
            <Button onClick={getDataFirebase} variant="contained" endIcon={<ReplayIcon/>} disabled={isLoading}>
                Reload
            </Button>
        </Box>
        {isLoading
            ?
            <Box sx={{display: 'flex', width: '100%', height: '70vh', justifyContent: 'center', alignItems: 'center'}}>
                <CircularProgress/>
            </Box>
            : <>
                <Box sx={{m: '1rem'}}>{getContent()}</Box>
            </>
        }
    </>
}
