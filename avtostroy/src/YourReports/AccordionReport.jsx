import React, {useEffect, useState, useCallback, useRef} from 'react'
import {lightBlue} from '@mui/material/colors'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary, Box,
    CircularProgress,
    Grid,
    ImageList,
    ImageListItem,
    Typography
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FolderIcon from '@mui/icons-material/Folder'
import {translation} from '../localization'
import {GoogleMap, Marker} from '@react-google-maps/api'
import mapStyles from '../googleMaps/mapsStyles'
import {useSelector} from 'react-redux'
import * as firebaseStorage from 'firebase/storage'

export const AccordionReport = ({index, reportObject, snapshot, user, report}) => {
    const [isOpened, setIsOpened] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [images, setImages] = useState({})
    const [imagesSearched, setImagesSearched] = useState(false)
    const {language} = useSelector(state => state.language)

    useEffect(() => {
        if (isOpened && !imagesSearched) {
            setIsLoading(true)
            if (snapshot?.exists()) {
                const responseData = snapshot.val()
                for (const key in responseData) {
                    for (const keyKey in responseData[key]) {
                        getImageURLs(key, keyKey).then(() => {
                            setImagesSearched(true)
                            setIsLoading(false)
                        })
                    }
                }
            }
        }
        // eslint-disable-next-line
    }, [isOpened, snapshot])

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

    const getImageURLs = async (dateRep, report) => {
        let imageURLs = []
        const reportInt = parseInt(report)
        if (!images[reportInt]) {
            const storage = firebaseStorage.getStorage()
            const imageListRef = firebaseStorage.ref(storage, `images/${user.uid}/${dateRep}/${report}`)
            const res = await firebaseStorage.listAll(imageListRef)
            for (const item of res.items) {
                const url = await firebaseStorage.getDownloadURL(item)
                imageURLs = [...imageURLs, url]
            }
            setImages(prev => {
                return {...prev, [reportInt]: imageURLs}
            })
        }
    }

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

    const ImagesComponent = ({report}) => {
        return images[report] ? images[report].length > 0 ?
                <ImageList sx={{width: '100%', height: 'fit-content'}} cols={window.innerWidth < 900 ? 1 : 3}>
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

    return <Accordion key={index} onChange={(e, ext) => setIsOpened(ext)}
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
            {isLoading
                ? <Box sx={{display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                    <CircularProgress/>
                </Box>
                : <>
                    <Grid container>
                        <Grid item xs={12} md={7}>
                            {imagesSearched && <MapComponent locations={reportObject.locations}/>}
                        </Grid>
                        <Grid item xs={12} md={5}
                              sx={{
                                  p: window.innerWidth > 900 ? '1rem' : '0',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  flexDirection: 'column'
                              }}>
                            <Typography variant="h6" sx={{p: '1rem 0'}}>
                                <b>{translation('ORGANIZATION', language)}</b>: {reportObject.organization || translation('NO_DATA', language)}
                            </Typography>
                            <Typography variant="h6" sx={{p: '1rem 0'}}>
                                <b>{translation('OBJECT_OF_WORK', language)}</b>: {reportObject.workObject || translation('NO_DATA', language)}
                            </Typography>
                            <Typography variant="h6" sx={{p: '1rem 0'}}>
                                <b>{translation('TYPE_OF_WORK', language)}</b>: {reportObject.workType || translation('NO_DATA', language)}
                            </Typography>
                            <Typography variant="h6" sx={{p: '1rem 0'}}>
                                <b>{translation('VOLUME_OF_WORK', language)}</b>: {reportObject.workVolume || translation('NO_DATA', language)}
                            </Typography>
                        </Grid>
                    </Grid>
                    <ImagesComponent report={report}/>
                </>}

        </AccordionDetails>
    </Accordion>
}
