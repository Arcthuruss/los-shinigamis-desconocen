import oguGif from './assets/ogu.gif'
import './App.css'
import {useState} from "react";
import "./Graph.tsx"
import Graph from "./Graph.tsx";
import Prediction from "./Prediction.tsx";

function App() {

    const [currentScreen, setCurrentScreen] = useState<"graph" | "prediction">("graph");

    let mainScreen;

    switch (currentScreen) {
        case "graph":
            mainScreen = Graph();
            break;
        case "prediction":
            mainScreen = Prediction();
            break;
    }

    return (
        <>
            <header className="flex items-center justify-around flex-row sticky top-0 border-2">
                <div className="flex flex-row items-center justify-center">
                    <img src={oguGif} alt="oguri logo" className="w-1/8"/>
                    <h1>Los Shinigamis desconocen</h1>
                </div>
                <button onClick={() => setCurrentScreen("graph")}>
                    Graphes
                </button>
                <button onClick={() => setCurrentScreen("prediction")}>
                    Prédictions
                </button>
            </header>
            {mainScreen}
        </>
    )
}

export default App
