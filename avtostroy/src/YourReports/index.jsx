import React, {useEffect, useState} from 'react'
import {child, get, getDatabase, ref} from 'firebase/database'
import {appCheck} from '../firebaseHelper'
import {useSelector} from 'react-redux'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    CircularProgress,
    Typography
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {useNavigate} from 'react-router-dom'
import { lightBlue, blue } from '@mui/material/colors';
import FolderIcon from '@mui/icons-material/Folder';
import ReplayIcon from '@mui/icons-material/Replay';

export const YourReports = () => {
    const [data, setData] = useState(<></>)
    const {user} = useSelector(state => state.user)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const getData = async () => {
        setIsLoading(true)
        const dbRef = ref(getDatabase())
        await appCheck()
        get(child(dbRef, 'reports/' + user.uid)).then((snapshot) => {
            if (snapshot.exists()) {
                const responseData = snapshot.val()
                const components = Object.keys(responseData).reverse().map((val, i) => {
                    const reports = Object.keys(responseData[val]).map((report, index) => {
                        const reportObject = responseData[val][report]
                       return <Accordion key={index} sx={{backgroundColor: lightBlue[100], border: '1px solid'+lightBlue[200]}}>
                           <AccordionSummary
                               expandIcon={<ExpandMoreIcon/>}
                               aria-controls={`panel${index}-content`}
                               id={`panel${index}-header`}>
                               <Typography sx={{display:'flex'}}>
                                   <FolderIcon sx={{marginRight: '1rem'}} color='primary'/>
                                   {reportObject.timeCreation}
                               </Typography>
                           </AccordionSummary>
                           <AccordionDetails sx={{backgroundColor: lightBlue[50]}}>
                               <Typography>Organization: {reportObject.organization}</Typography>
                               <Typography>Object of work: {reportObject.workObject}</Typography>
                               <Typography>Type of work: {reportObject.workType}</Typography>
                           </AccordionDetails>
                       </Accordion>
                    })
                    return <Accordion key={i} sx={{backgroundColor: blue[50], border: '1px solid'+lightBlue[100]}}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls={`panel${i}-content`}
                            id={`panel${i}-header`}>
                            <Typography sx={{display:'flex'}}>
                                <FolderIcon sx={{marginRight: '1rem'}} color='primary'/>
                                {val.replaceAll('_', '/')}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {reports}
                        </AccordionDetails>
                    </Accordion>
                })

                setData(components)
            } else {
                setData(<h3>No data available</h3>)
            }
        }).catch((error) => {
            console.error(error)
        }).finally(() => setIsLoading(false))
    }

    useEffect(() => {
        if (user) {
            getData()
        } else {
            navigate('/login')
        }
        // eslint-disable-next-line
    }, [])

    return <>
        <Box sx={{display:'flex', padding: '1rem'}} justifyContent='space-between' alignItems='center'>
            <Typography variant='h4' component='h1'>Your reports</Typography>
            <Button onClick={getData} variant='contained' endIcon={<ReplayIcon/>} disabled={isLoading}>
                Reload
            </Button>
        </Box>
        {isLoading
            ?
            <Box sx={{display: 'flex', width: '100%', height: '70vh', justifyContent: 'center', alignItems: 'center'}}>
                <CircularProgress/>
            </Box>
            : <>
                <Box sx={{margin: '1rem'}}>{data}</Box>
            </>
        }

    </>
}
