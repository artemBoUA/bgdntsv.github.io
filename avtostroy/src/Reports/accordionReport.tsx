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
import {GoogleMap, Marker} from '@react-google-maps/api'
import mapStyles from '../googleMaps/mapsStyles'
import * as firebaseStorage from 'firebase/storage'
import {useTranslation} from 'react-i18next'

type accordionReportPropTypes = {
    index: number
    reportObject: {
        organization: string
        workObject: string
        workType: string
        workVolume: string
        locations: Array<google.maps.LatLngLiteral>
        timeCreation: string
    }
    user: {
        uid: number | string
    }
    report: string
    dateRep: string
}
export const AccordionReport = ({index, reportObject, user, report, dateRep}: accordionReportPropTypes) => {
    type imagesType = {
        [report: string]: Array<string>
    }
    const [isOpened, setIsOpened] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [images, setImages] = useState<imagesType>({})
    const [imagesSearched, setImagesSearched] = useState(false)
    const {t} = useTranslation()
    const mapRef = useRef<google.maps.Map>()

    useEffect(() => {
        if (isOpened && !imagesSearched) {
            setIsLoading(true)
            getImageURLs().then(() => setIsLoading(false))
        }
        // eslint-disable-next-line
    }, [isOpened])

    const options = {
        disableDefaultUI: true,
        styles: mapStyles,
        zoomControl: true,
        fullscreenControl: true
    }
    const onMapLoad = useCallback(
        (map: google.maps.Map) => {
            mapRef.current = map
        },
        []
    )

    const getImageURLs = async () => {
        let imageURLs: Array<string> = []
        if (!images[report]) {
            const storage = firebaseStorage.getStorage()
            const imageListRef = firebaseStorage.ref(storage, `images/${user.uid}/${dateRep}/${report}`)
            const res = await firebaseStorage.listAll(imageListRef)
            for (const item of res.items) {
                const url = await firebaseStorage.getDownloadURL(item)
                imageURLs = [...imageURLs, url]
            }
            setImages(prev => {
                return {...prev, [report]: imageURLs}
            })
        }
        setImagesSearched(true)
    }

    const MapComponent = useCallback(({locations}: { locations: Array<google.maps.LatLngLiteral> }) => {
        return <GoogleMap mapContainerStyle={{width: '100%', minHeight: '100%', height: '400px'}}
                          zoom={14}
                          options={options}
                          center={locations[0]}
                          onLoad={onMapLoad}>
            {locations.map((marker, i) => <Marker key={i}
                                                  position={{lat: marker.lat, lng: marker.lng}}
                                                  icon={{
                                                      url: '/markerImg.svg',
                                                      scaledSize: new google.maps.Size(25, 25),
                                                      origin: new google.maps.Point(0, 0),
                                                      anchor: new google.maps.Point(15, 15)
                                                  }}
            />)}
        </GoogleMap>
        //eslint-disable-next-line
    }, [])

    const ImagesComponent = ({report}: { report: keyof typeof images }) => {
        return images[report] ? images[report].length > 0 ?
                <ImageList sx={{width: '100%', height: 'fit-content'}} cols={window.innerWidth < 900 ? 1 : 3}>
                    {images[report].map((item: string, i: number) => (
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
                                <b>{t('ORGANIZATION')}</b>: {reportObject.organization || t('NO_DATA')}
                            </Typography>
                            <Typography variant="h6" sx={{p: '1rem 0'}}>
                                <b>{t('OBJECT_OF_WORK')}</b>: {reportObject.workObject || t('NO_DATA')}
                            </Typography>
                            <Typography variant="h6" sx={{p: '1rem 0'}}>
                                <b>{t('TYPE_OF_WORK')}</b>: {reportObject.workType || t('NO_DATA')}
                            </Typography>
                            <Typography variant="h6" sx={{p: '1rem 0'}}>
                                <b>{t('VOLUME_OF_WORK')}</b>: {reportObject.workVolume || t('NO_DATA')}
                            </Typography>
                        </Grid>
                    </Grid>
                    <ImagesComponent report={report}/>
                </>}
        </AccordionDetails>
    </Accordion>
}
