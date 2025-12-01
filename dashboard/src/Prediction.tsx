import {useState} from "react";
import { Cardio } from 'ldrs/react';
import 'ldrs/react/Cardio.css';
import {get_prediction} from "./data.ts";
import useSound from "use-sound";
import DoTFD from "./assets/DoTFD.ogg"
import finalHours from "./assets/FinalHours.mp3"
import Countdown from "react-countdown";
import Select from "react-select";

export default function Prediction() {
    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [dob, setDob] = useState<string>("");
    const [expectancy, setExpectancy] = useState<number | undefined>(undefined);
    const [deathDate, setDeathDate] = useState<Date | undefined>(undefined);
    const [type_pred, setTypePred] = useState<string>("name or surname");

    const [result, setResult] = useState<boolean | null>(null);

    const [playDoTFD, {stop: stopDoTFD}] = useSound(DoTFD)
    const [playFinalHours, {stop: stopFinalHours}] = useSound(finalHours)

    return (
        <>
            <main className="grid grid-cols-2 justify-around gap-4 pt-[4vh]">
                <div>
                    <p>Choice of prediction</p>
                    <Select
                        className="bg-white border border-black rounded p-2 w-full text-black"
                        required
                        options={[
                            { value: 'name or surname', label: 'Name or Surname' },
                            { value: 'name and surname', label: 'Name and Surname' },
                            { value: 'surname only', label: 'Surname Only' },
                            { value: 'name only', label: 'Name Only' },
                        ]}
                        onChange={(selectedOption) => {
                            if (selectedOption) {
                                setTypePred(selectedOption.value);
                            }
                        }}
                        defaultValue={{ value: 'name or surname', label: 'Name or Surname' }}
                    />

                    <p className="text-left">Name</p>
                    <input type="text" name="name" className="bg-white border border-black rounded p-2 w-full text-black"
                    onBlur={(e) => setName(e.target.value)}
                    />
                    <p className="text-left">Surname</p>
                    <input type="text" name="surname" className="bg-white border border-black rounded p-2 w-full text-black"
                    onBlur={(e) => setSurname(e.target.value)}
                    />
                    <p className="text-left">Date of birth</p>
                    <input type="date" name="dob" className="bg-white border border-black rounded p-2 w-full text-black"
                    onBlur={(e) => setDob(e.target.value)}
                    />
                    <button
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => {
                            setResult(false);
                            stopDoTFD()
                            stopFinalHours()
                            // Appeler la fonction de prédiction avec les valeurs actuelles de name et surname
                            get_prediction(name, surname, type_pred)
                                .then(
                                    (avg_expectancy) => {
                                        // Set la data
                                        console.log(avg_expectancy);
                                        setExpectancy(avg_expectancy);
                                        // Calcul de la date de décès estimée
                                        const birthDate = new Date(dob);
                                        setDeathDate(new Date(birthDate.getFullYear() + avg_expectancy, birthDate.getMonth(), birthDate.getDate()));
                                        console.log(`Predicted death date: ${deathDate?.toDateString()}`);
                                        setResult(true);
                                        playDoTFD()
                                        playFinalHours()
                                    },
                                    (err) => console.log(err)
                                );
                        }}
                    >
                        Predict
                    </button>
                </div>

                <div className={result === null?"hidden":"items-center"}>
                    <h1 className={result?"":"hidden"}>Result</h1>
                    <div className={result?"hidden":""}>
                        <Cardio
                            size="125"
                            stroke="4"
                            speed="1"
                            color="red"
                        />
                    </div>
                    <div id="result" className={result?'border border-white rounded p-4 w-full text-2xl/10':'hidden'}>
                        {/* Animation de turbo stupido ah developer */}
                        <p>Name: {name}</p>
                        <p>Surname: {surname}</p>
                        <p>Date of Birth: {dob}</p>
                        <p>Predicted Age Expectancy: {Math.round(expectancy as number)}</p>
                        <p>Death at : {deathDate?.toDateString()}</p>
                    </div>
                </div>
                {result?<Countdown
                    date={deathDate}
                    renderer={
                        ({days, hours, minutes, seconds}) => {
                            return <h1 className={"col-span-full"}>{days}:{hours}:{minutes}:{seconds}</h1>
                        }
                    }
                />:<></>}
            </main>
        </>
    )
}