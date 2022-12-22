import {Route, Routes} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {useLoadScript} from '@react-google-maps/api'
import {GOOGLE_API_KEY} from './utils/googleMapHelper'
import React, {lazy, Suspense} from 'react'
import Loader from './Loader/loader'
import Toast from './Toast/toast'
import {rootStateType} from './redux/store'

const Home = lazy(() => import('./Home/home'))
const Header = lazy(() => import('./Header/header'))
const Login = lazy(() => import('./Login/login'))
const Report = lazy(() => import('./Report/report'))
const Reports = lazy(() => import('./Reports/reports'))
const ErrorPage = lazy(() => import('./404/errorPage'))

function App() {
    const {user} = useSelector((state: rootStateType) => state.user)
    const {isLoaded} = useLoadScript({
        googleMapsApiKey: GOOGLE_API_KEY
    })
    return <>
        <Toast/>
        <Suspense fallback={<Loader/>}>
            <Header/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={user ? <Home/> : <Login/>}/>
                <Route path="/report" element={user ? isLoaded
                        ? <Report user={user}/>
                        : <Loader/>
                    : <Login/>}/>
                <Route path="/your-reports" element={user ? isLoaded
                        ? <Reports user={user}/>
                        : <Loader/>
                    : <Login/>}/>
                <Route path="*" element={<ErrorPage/>}/>
            </Routes>
        </Suspense>
    </>
}

export default App
