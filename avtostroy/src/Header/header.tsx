import {
    Select,
    Button,
    Avatar,
    Tooltip,
    Container,
    MenuItem,
    Menu,
    Typography,
    IconButton,
    Toolbar,
    Box, SelectChangeEvent
} from '@mui/material'
import AppBar from '@mui/material/AppBar'
import MenuIcon from '@mui/icons-material/Menu'
import {initializeApp} from 'firebase/app'
import {getAuth, signOut} from 'firebase/auth'
import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import logo from '../rdsLogo.png'
import {firebaseConfig} from '../utils/firebaseHelper'
import TranslateIcon from '@mui/icons-material/Translate'
import {deleteUser} from '../redux/slices/userSlice'
import {rootStateType} from '../redux/store'
import {useTranslation} from 'react-i18next'
import {languageType} from '../localization/translation'

const Header = () => {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
    const navigate = useNavigate()
    const {user} = useSelector((state: rootStateType) => state.user)
    const dispatch = useDispatch()
    const {t, i18n} = useTranslation()

    const handleSetLanguage = (e: SelectChangeEvent<languageType>) => {
        i18n.changeLanguage(e.target.value)
    }

    const handleOpenNavMenu = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(e.currentTarget)
    }
    const handleOpenUserMenu = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(e.currentTarget)
    }

    const handleCloseNavMenu = () => {
        setAnchorElNav(null)
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null)
    }

    const logOut = async () => {
        const firebaseApp = initializeApp(firebaseConfig)
        const auth = getAuth(firebaseApp)
        await signOut(auth)
        await dispatch(deleteUser())
        navigate('/login', {replace: true})
        handleCloseUserMenu()
        // window.sessionStorage.removeItem('_user_Avtostroy_report_project')
    }

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>

                    {/*****************Mobile Start*****************/}

                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar"
                                    aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                            keepMounted
                            transformOrigin={{vertical: 'top', horizontal: 'left'}}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{display: {xs: 'block', md: 'none'}}}>
                            <MenuItem onClick={() => {
                                navigate('/report')
                                setAnchorElNav(null)
                            }}>
                                <Typography textAlign="center">{t('REPORT')}</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => {
                                navigate('/your-reports')
                                setAnchorElNav(null)
                            }}>
                                <Typography textAlign="center">{t('YOUR_REPORTS')}</Typography>
                            </MenuItem>

                        </Menu>

                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        onClick={() => navigate('/')}
                        sx={{
                            mr: 2, display: {xs: 'flex', md: 'none'}, flexGrow: 1, fontFamily: 'monospace',
                            fontWeight: 700, letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none'
                        }}>
                        <img src={logo} height="25px" alt="RDS"/>
                    </Typography>
                    {/*****************Mobile End*****************/}

                    {/*****************Desktop Start*****************/}
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        onClick={() => navigate('/')}
                        sx={{
                            mr: 2, display: {xs: 'none', md: 'flex'}, fontFamily: 'monospace', fontWeight: 700,
                            letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none'
                        }}>
                        <img src={logo} alt="RDS" height="25px"/>
                    </Typography>

                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        <Button onClick={() => navigate('/report')}
                                sx={{my: 2, color: 'white', display: 'block'}}>
                            {t('REPORT')}</Button>
                        <Button onClick={() => navigate('/your-reports')}
                                sx={{my: 2, color: 'white', display: 'block'}}>
                            {t('YOUR_REPORTS')}</Button>

                    </Box>

                    {/*****************Desktop End*****************/}
                    <Select
                        variant="standard"
                        value={i18n.language as languageType}
                        IconComponent={TranslateIcon}
                        onChange={handleSetLanguage}
                        inputProps={{'aria-label': 'Without label'}}
                    >
                        <MenuItem value={'ua'}>UA</MenuItem>
                        <MenuItem value={'en'}>EN</MenuItem>
                    </Select>

                    <Box sx={{flexGrow: 0}}>
                        <Tooltip title={user ? t('OPEN_SETTINGS') as string : ''}>
                            <IconButton onClick={(e) => user ? handleOpenUserMenu(e) : navigate('/login')}
                                        sx={{fontSize: '14px', borderRadius: '1rem', padding: '0 0.5rem'}}
                                        color="inherit">
                                {user ? user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] : t('SIGN_IN')}
                                <Avatar sx={{marginLeft: '8px'}} alt={user?.displayName || user?.email || 'user image'}
                                        src={user?.photoURL || ''} imgProps={{referrerPolicy: 'no-referrer'}}/>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{mt: '45px'}}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                            keepMounted
                            transformOrigin={{vertical: 'top', horizontal: 'right'}}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}>
                            <MenuItem onClick={logOut}>
                                <Typography textAlign="center">{t('LOGOUT')}</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}
export default React.memo(Header)
