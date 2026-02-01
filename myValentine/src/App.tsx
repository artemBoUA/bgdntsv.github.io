import rabbit from './assets/rabit.png'
import './App.css'
import {PrankComponent} from "./PrankComponent.tsx";

function App() {
    return (
        <div>
            <img src={rabbit} className="rabbit" alt="Rabit"/>
            <h1>Will you be my valentine?</h1>
            <PrankComponent/>
        </div>
    )
}

export default App
