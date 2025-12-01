import {useEffect, useState} from "react";
import {get_prediction} from "./data.ts";

export default function Prediction() {
    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [dob, setDob] = useState<string>("");

    return (
        <>
            <main className="grid grid-cols-2 justify-around gap-4 pt-[4vh]">
                <div>
                    <p>Age expectancy prediction</p>
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
                            // Appeler la fonction de prédiction avec les valeurs actuelles de name et surname
                            get_prediction(name, surname)
                                .then(
                                    (data) => {
                                        // Set la data
                                        console.log(data);
                                        const age_expectancy = data.avg_expectancy;
                                        // Calcul de la date de décès estimée
                                        const birthDate = new Date(dob);
                                        const deathDate = new Date(birthDate.getFullYear() + age_expectancy, birthDate.getMonth(), birthDate.getDate());
                                        console.log(`Predicted death date: ${deathDate.toDateString()}`);

                                    },
                                    (err) => console.log(err)
                                );
                        }}
                    >
                        Predict
                    </button>
                </div>

                <div>
                    <p> Result </p>
                    <div id="result" className="bg-white border border-black rounded p-4 w-full text-black">
                        {/* Animation de turbo stupido ah developer */}
                        <p>Name: {name}</p>
                        <p>Surname: {surname}</p>
                        <p>Date of Birth: {dob}</p>
                        <p>Predicted Age Expectancy: {}</p>
                        <p>Death at : {}</p>
                        { /* Compteur */}
                    </div>

                </div>
            </main>
        </>
    )
}