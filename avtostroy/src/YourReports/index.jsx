import React, {useEffect, useState} from 'react'
import {child, get, getDatabase, ref} from 'firebase/database'
import {appCheck} from '../firebaseHelper'
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
import {lightBlue, blue, indigo} from '@mui/material/colors'
import FolderIcon from '@mui/icons-material/Folder'
import ReplayIcon from '@mui/icons-material/Replay'
import {translation} from '../localization'
import {useSelector} from 'react-redux'
import {AccordionReport} from './AccordionReport'
import hash from 'object-hash'
import {HashArray} from '../hashes'

export const YourReports = ({user}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [snapshot, setSnapshot] = useState()
    const {language} = useSelector(state => state.language)
    const isNotUser = HashArray.includes(hash(user.uid))

    const getDataFirebase = async () => {
        setIsLoading(true)
        const dbRef = ref(getDatabase())
        await appCheck()
        const path = `reports${isNotUser ? '' : '/' + user.uid}`
        const resSnapshot = await get(child(dbRef, path))
        setSnapshot(resSnapshot)
        setIsLoading(false)
    }

    const UserContent = ({responseData}) => {
        return Object.keys(responseData).reverse().map((dateRep, i) => {
            const reports = Object.keys(responseData[dateRep]).map((report, index) => {
                const reportObject = responseData[dateRep][report]
                return <AccordionReport index={index} reportObject={reportObject} snapshot={snapshot} user={user}
                                        report={report} key={index}/>
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
    }

    const getContent = () => {
        if (snapshot?.exists()) {
            const responseData = snapshot.val()
            if (isNotUser) {
                return Object.keys(responseData).map((item, index) => {
                    return <Accordion key={index} sx={{backgroundColor: indigo[50], border: '1px solid' + blue[100]}}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                            <FolderIcon sx={{marginRight: '1rem'}} color="primary"/>
                            {Object.values(Object.values(responseData[item])[0])[0].owner}
                        </AccordionSummary>
                        <AccordionDetails>
                            <UserContent responseData={responseData[item]}/>
                        </AccordionDetails>
                    </Accordion>
                })
            } else {
                return <UserContent responseData={responseData}/>
            }
        } else {
            return <h3>{translation('NO_REPORT_AVAILABLE', language)}</h3>
        }
    }

    useEffect(() => {
        getDataFirebase()
        // eslint-disable-next-line
    }, [])

    return <>
        <Box sx={{display: 'flex', padding: '1rem'}} justifyContent="space-between" alignItems="center">
            <Typography variant="h4"
                        component="h1">{translation(isNotUser ? 'ALL_REPORTS' : 'YOUR_REPORTS', language)}</Typography>
            <Button onClick={getDataFirebase} variant="contained" endIcon={<ReplayIcon/>} disabled={isLoading}>
                {translation('RELOAD', language)}
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
