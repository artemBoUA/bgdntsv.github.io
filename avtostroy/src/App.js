import Login from './Login'
import {Route, Routes} from 'react-router-dom'
import {Home} from './Home'
import {Header} from './Header'
import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {bindActionCreators} from 'redux'
import {actionCreators} from './redux/actionCreators.js'
import {ErrorPage} from './404'
import {Report} from './Report'
import {YourReports} from './YourReports'
import {useLoadScript} from '@react-google-maps/api'
import {GOOGLE_API_KEY} from './googleMapHelper'
import {Box, CircularProgress} from '@mui/material'

function App() {
    const dispatch = useDispatch()
    const {user} = useSelector(state => state.user)
    const {isLoaded} = useLoadScript({
        googleMapsApiKey: GOOGLE_API_KEY
    })
    useEffect(() => {
        const user = window.sessionStorage.getItem('_user_Avtostroy_report_project')
        if (user) {
            const AC = bindActionCreators(actionCreators, dispatch)
            AC.setUserActionCreator(JSON.parse(user))
        }
    }, [dispatch])

    const LoadingComponent = <Box sx={{display: 'flex', justifyContent:'center', alignItems:'center', mt:'2rem'}}>
        <CircularProgress/>
    </Box>

    return <>
        <Header/>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={user ? <Home/> : <Login/>}/>
            <Route path="/report" element={user ? isLoaded
                    ? <Report user={user}/>
                    : LoadingComponent
                : <Login/>}/>
            <Route path="/your-reports" element={user ? isLoaded
                    ? <YourReports user={user}/>
                    : LoadingComponent
                : <Login/>}/>
            <Route path="*" element={<ErrorPage/>} replace/>
        </Routes>
    </>
}

export default App
