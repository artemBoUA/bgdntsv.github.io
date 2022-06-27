import {GoogleMap, InfoWindow, Marker} from '@react-google-maps/api'
import {GOOGLE_API_KEY} from '../googleMapHelper'
import {Button, IconButton} from '@mui/material'
import React, {useCallback, useRef, useState} from 'react'
import mapStyles from './mapsStyles'
import Typography from '@mui/material/Typography'
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined'
import {yellow} from '@mui/material/colors'
import {appCheck} from '../firebaseHelper'

const axios = require('axios')


export const Map = ({setIsMessageOpen, setMessageText, setMessageType, markers, setMarkers}) => {
    const [selected, setSelected] = useState(null)

    const options = {
        disableDefaultUI: true,
        styles: mapStyles,
        zoomControl: true,
        fullscreenControl: true
    }

    const handleMapClick = useCallback(
        async (event) => {
            await appCheck()
            const config = {
                method: 'get',
                url: `https://roads.googleapis.com/v1/nearestRoads?points=${event.latLng.lat()}%2C${event.latLng.lng()}&key=${GOOGLE_API_KEY}`,
                headers: {}
            }
            axios(config)
                .then(function (response) {
                    let pars = JSON.stringify(response.data)
                    pars = JSON.parse(pars)
                    if (pars.snappedPoints) {
                        setMarkers(prev => [
                            ...prev,
                            {
                                lat: pars.snappedPoints[0].location.latitude,
                                lng: pars.snappedPoints[0].location.longitude
                            }])
                    }
                })
                .catch(function (error) {
                    setIsMessageOpen(true)
                    setMessageText(error.message)
                    setMessageType('error')
                })
            setSelected(null)
            // eslint-disable-next-line
        }, []
    )

    const mapRef = useRef()
    const onMapLoad = useCallback(
        (map) => {
            mapRef.current = map
            mapRef.current.setCenter({lat: 46.952285025233536, lng: 32.007997})
        },
        []
    )

    const deleteMark = () => {
        setSelected(null)
        setMarkers(prev => prev.filter((marker) => marker !== selected))
    }

    const deleteMarkers = () => {
        setSelected(null)
        setMarkers([])
    }
    const panTo = useCallback(({lat, lng}) => {
        mapRef.current.panTo({lat, lng})
        mapRef.current.setZoom(12)
    }, [])

    const Locate = ({panTo}) => {
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

    return <>
        <GoogleMap mapContainerStyle={{width: window.innerWidth < 900 ? '95vw' : '100%', minHeight: '400px', height:'100%'}}
                   zoom={9}
                   options={options}
                   onClick={handleMapClick}
                   onLoad={onMapLoad}>
            {markers[0] && <Button sx={{m: '.5rem'}} variant="contained" size="small"
                                   onClick={deleteMarkers}>Delete marks</Button>}
            {markers.map((marker, i) => <Marker key={i}
                                                position={marker}
                                                onClick={() => setSelected(marker)}
                                                icon={{
                                                    url: '/markerImg.svg',
                                                    scaledSize: new window.google.maps.Size(25, 25),
                                                    origin: new window.google.maps.Point(0, 0),
                                                    anchor: new window.google.maps.Point(15, 15)
                                                }}/>)}
            {selected && <InfoWindow position={{lat: selected.lat, lng: selected.lng}}
                                     onCloseClick={() => setSelected(null)}>
                <div>
                    <Typography variant="h7" component="h4">Do you want to delete this mark?</Typography>
                    <Button
                        onClick={deleteMark} sx={{margin: '.2rem 0 .2rem auto', display: 'flex'}}>
                        Delete</Button>
                </div>
            </InfoWindow>}
            <Locate panTo={panTo}/>
        </GoogleMap>
    </>
}
