import React, {useEffect, useState} from 'react'
import {child, get, getDatabase, ref} from 'firebase/database'
import {appCheck} from '../utils/firebaseHelper'
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
import {AccordionReport} from './accordionReport'
import hash from 'object-hash'
import {HashArray} from '../utils/hashes'
import {useTranslation} from 'react-i18next'
import firebase from 'firebase/compat'
import {getErrorMessage} from '../utils/utils'
import {setMessage} from '../redux/slices/messageSlice'
import {useDispatch} from 'react-redux'

const Reports = ({user}: { user: firebase.User }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [snapshot, setSnapshot] = useState({} as firebase.database.DataSnapshot)
    const dispatch = useDispatch()
    const isNotUser = HashArray.includes(hash(user.uid))
    const {t} = useTranslation()
    const getDataFirebase = async () => {
        setIsLoading(true)
        try {
            const dbRef = ref(getDatabase())
            await appCheck()
            const path = `reports${isNotUser ? '' : '/' + user.uid}`
            const resSnapshot = await get(child(dbRef, path))
            // @ts-ignore
            setSnapshot(resSnapshot)
        } catch (error) {
            const errorMessage = getErrorMessage(error)
            dispatch(setMessage({text: errorMessage, type: 'error'}))
        } finally {
            setIsLoading(false)
        }
    }

    const userContent = (responseData: any) => {
        return Object.keys(responseData).map((dateRep, i) => {
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
                    {Object.keys(responseData[dateRep]).map((report, index) => {
                        const reportObject = responseData[dateRep][report]
                        return <AccordionReport index={index} reportObject={reportObject} user={user}
                                                report={report} key={index} dateRep={dateRep}/>
                    })}
                </AccordionDetails>
            </Accordion>
        })
    }

    const getContent = () => {
        if (snapshot.exists && snapshot.exists()) {
            const responseData = snapshot.val()
            const getOwnerName = (item: string) => {
                const userReports: object = responseData[item]
                if (userReports) {
                    const userDateReport = userReports[Object.keys(userReports)[0] as keyof typeof userReports]
                    if (userDateReport) {
                        const userReport: { owner: string } = userDateReport[Object.keys(userDateReport)[0] as keyof typeof userDateReport]
                        return userReport?.owner
                    }
                }
            }
            if (isNotUser && responseData) {
                return Object.keys(responseData).map((item, index) => {
                    return <Accordion key={index} sx={{backgroundColor: indigo[50], border: '1px solid' + blue[100]}}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                            <FolderIcon sx={{marginRight: '1rem'}} color="primary"/>
                            {getOwnerName(item)}
                        </AccordionSummary>
                        <AccordionDetails>
                            {userContent(responseData[item])}
                        </AccordionDetails>
                    </Accordion>
                })
            } else {
                return userContent(responseData)
            }
        } else {
            return <h3>{t('NO_REPORT_AVAILABLE')}</h3>
        }
    }

    useEffect(() => {
        getDataFirebase()
        // eslint-disable-next-line
    }, [])

    return <>
        <Box sx={{display: 'flex', padding: '1rem'}} justifyContent="space-between" alignItems="center">
            <Typography variant="h4"
                        component="h1">{t(isNotUser ? 'ALL_REPORTS' : 'YOUR_REPORTS')}</Typography>
            <Button onClick={getDataFirebase} variant="contained" endIcon={<ReplayIcon/>} disabled={isLoading}>
                {t('RELOAD')}
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

export default React.memo(Reports)
