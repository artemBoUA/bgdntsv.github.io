import {useSelector} from 'react-redux'

export const Home = () => {
    const {user} = useSelector(state => state.user)

    return<div>
       <h1>Welcome to Home, {user?.displayName || user?.email}</h1>
    </div>
}
