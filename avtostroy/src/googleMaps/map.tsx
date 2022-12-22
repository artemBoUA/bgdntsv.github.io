import {GoogleMap, InfoWindowF, Marker} from '@react-google-maps/api'
import {GOOGLE_API_KEY} from '../utils/googleMapHelper'
import {Button, IconButton} from '@mui/material'
import React, {useCallback, useRef, useState} from 'react'
import mapStyles from './mapsStyles'
import Typography from '@mui/material/Typography'
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined'
import {yellow} from '@mui/material/colors'
import {appCheck} from '../utils/firebaseHelper'
import {useDispatch} from 'react-redux'
import axios from 'axios'
import {setMessage} from '../redux/slices/messageSlice'
import {getErrorMessage} from '../utils/utils'
import {useTranslation} from 'react-i18next'

type mapPropTypes = {
    markers: Array<google.maps.LatLngLiteral>,
    setMarkers: React.Dispatch<React.SetStateAction<Array<google.maps.LatLngLiteral>>>
}
const Map = ({markers, setMarkers}: mapPropTypes) => {
    const [selected, setSelected] = useState<google.maps.LatLngLiteral | null>(null)
    const mapRef = useRef<google.maps.Map>()
    const dispatch = useDispatch()
    const {t} = useTranslation()
    const options = {
        disableDefaultUI: true,
        styles: mapStyles,
        zoomControl: true,
        fullscreenControl: true
    }

    const handleMapClick = useCallback(
        async (event: google.maps.MapMouseEvent) => {
            if (event.latLng && event.latLng) {
                try {
                    await appCheck()
                    const config = {
                        method: 'get',
                        url: `https://roads.googleapis.com/v1/nearestRoads?points=${event.latLng.lat()}%2C${event.latLng.lng()}&key=${GOOGLE_API_KEY}`,
                        headers: {}
                    }
                    const response = await axios(config)
                    let pars = JSON.stringify(response.data)
                    pars = JSON.parse(pars)
                    // @ts-ignore
                    if (pars?.snappedPoints) {
                        setMarkers((prev) => [
                            ...prev,
                            {
                                // @ts-ignore
                                lat: pars?.snappedPoints[0].location.latitude,
                                // @ts-ignore
                                lng: pars?.snappedPoints[0].location.longitude
                            }])
                    }
                    setSelected(null)
                } catch (e) {
                    dispatch(setMessage({text: getErrorMessage(e), type: 'error'}))
                }
            }
        },
        //eslint-disable-next-line
        []
    )

    const onMapLoad = useCallback(
        (map: google.maps.Map) => {
            mapRef.current = map
            mapRef.current?.setCenter({lat: 46.952285025233536, lng: 32.007997})
        },
        []
    )

    const panTo = useCallback(
        ({lat, lng}: google.maps.LatLngLiteral) => {
            mapRef.current?.panTo({lat, lng})
            mapRef.current?.setZoom(12)
        },
        []
    )


    const deleteMark = () => {
        setMarkers(prev => prev.filter((marker) => marker !== selected))
        setSelected(null)
    }

    const deleteMarkers = () => {
        setMarkers([])
        setSelected(null)
    }

    type panToType = { panTo: (prop: google.maps.LatLngLiteral) => void }
    const Locate = ({panTo}: panToType) => {
        const handleClick = () => {
            navigator.geolocation.getCurrentPosition((position) => {
                panTo({lat: position.coords.latitude, lng: position.coords.longitude})
            })
        }
        return <IconButton aria-label="upload picture" component="span" onClick={handleClick} size="small"
                           sx={{bottom: '20px', position: 'absolute', left: '0'}}>
            <ExploreOutlinedIcon sx={{color: yellow[400], fontSize: '35px'}}/>
        </IconButton>
    }
    const DeleteMarks = () => {
        return markers.length > 0
            ? (<Button sx={{m: '.5rem'}} variant="contained" size="small"
                       onClick={deleteMarkers}>{t('DELETE_MARKS')}</Button>)
            : <></>
    }
    const MarkInfoWindow = () => {
        return selected
            ? <InfoWindowF position={{lat: selected.lat, lng: selected.lng}}
                           onCloseClick={() => setSelected(null)}>
                <>
                    <Typography variant="h6" component="h4">{t('DELETE_THIS_MARK')}?</Typography>
                    <Button
                        onClick={deleteMark} sx={{margin: '.2rem 0 .2rem auto', display: 'flex'}} size="small">
                        {t('DELETE')}</Button>
                </>
            </InfoWindowF>
            : <></>
    }

    return <>
        <GoogleMap
            mapContainerStyle={{width: window.innerWidth < 900 ? '95vw' : '100%', minHeight: '400px', height: '100%'}}
            zoom={9}
            options={options}
            onClick={handleMapClick}
            onLoad={onMapLoad}>
            <DeleteMarks/>
            {markers.map((marker, i) => <Marker key={i}
                                                position={marker}
                                                onClick={() => {
                                                    setSelected(marker)
                                                }}
                                                icon={{
                                                    url: '/markerImg.svg',
                                                    scaledSize: new google.maps.Size(25, 25),
                                                    origin: new google.maps.Point(0, 0),
                                                    anchor: new google.maps.Point(15, 15)
                                                }}/>)}
            <MarkInfoWindow/>
            <Locate panTo={panTo}/>
        </GoogleMap>
    </>
}
export default React.memo(Map)
