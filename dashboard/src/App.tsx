import oguGif from './assets/ogu.gif'
import './App.css'
import {get_deces_year} from "./data.ts";
import {useEffect, useState} from "react";


function App() {

    const [data, setData] = useState<Array<JSON>>([])

    useEffect(() => {
        get_deces_year(2010)
            .then((data) => setData(data))
            .catch((err) => console.log(err))

    })

    return (
        <>
            <header className="flex items-center justify-around flex-row sticky top-0 border-2">
                <div className="flex flex-row items-center justify-center">
                    <img src={oguGif} alt="oguri logo" className="w-1/8"/>
                    <h1>Los Shinigamis desconocen</h1>
                </div>
                <button>Graphes</button>
                <button>Prédictions</button>
            </header>
            <main>
            </main>
        </>
    )
}

export default App
