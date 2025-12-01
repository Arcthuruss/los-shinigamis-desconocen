const url = "http://localhost:8000/deces"

async function get_deces_year(year: number, fields = ["date_deces"]) {
    const params = new URLSearchParams();
    params.append("fields", fields.join(","))
    params.append("date_deces_start", `01-01-${year}`);
    params.append("date_deces_end", `10-01-${year}`);

    const response = await fetch(url + `?${params}`);

    const data = await response.json() as Array<JSON>;

    if (response.ok) {
        return data;
    } else {
        const error = new Error("no worky");
        return Promise.reject(error);
    }
}

async function get_deces_per_month(year: number | "all") {

    const response = await fetch(`http://localhost:8000/deces_par_mois/${year}`);

    const data = await response.json() as Array<{key: string, data: number}>;

    if (response.ok) {
        return data;
    } else {
        const error = new Error("no worky");
        return Promise.reject(error);
    }
}

async function get_deces_per_year(month: number | "all") {

    const response = await fetch(`http://localhost:8000/deces_par_annee/${month}`);

    const data = await response.json() as Array<{key: string, data: number}>;

    if (response.ok) {
        return data;
    } else {
        const error = new Error("no worky");
        return Promise.reject(error);
    }
}

async function get_prediction(nom: string, prenom: string, type_pred: string) {
    let avg_expectancy: number;

    try {
        if (type_pred === "name or surname") {
            const params = new URLSearchParams();
            params.append("nom", nom);
            params.append("avg_age_deces", "true");

            const response = await fetch(url + `?${params}`);
            if (!response.ok) throw new Error("Failed to fetch average for nom");
            const data = await response.json() as {avg: string}[];

            const params2 = new URLSearchParams();
            params2.append("prenom", prenom);
            params2.append("avg_age_deces", "true");

            const response2 = await fetch(url + `?${params2}`);
            if (!response2.ok) throw new Error("Failed to fetch average for prenom");
            const data2 = await response2.json() as {avg: string}[];

            avg_expectancy = (parseFloat(data[0].avg) + parseFloat(data2[0].avg)) / 2;
        } else if (type_pred === "name and surname") {
            const params = new URLSearchParams();
            params.append("nom", nom);
            params.append("prenom", prenom);
            params.append("avg_age_deces", "true");

            const response = await fetch(url + `?${params}`);
            if (!response.ok) throw new Error("Failed to fetch average for nom+prenom");
            const data = await response.json() as {avg: string}[];

            avg_expectancy = parseFloat(data[0].avg);
        } else if (type_pred === "surname only") {
            const params = new URLSearchParams();
            params.append("nom", nom);
            params.append("avg_age_deces", "true");

            const response = await fetch(url + `?${params}`);
            if (!response.ok) throw new Error("Failed to fetch average for nom");
            const data = await response.json() as {avg: string}[];

            avg_expectancy = parseFloat(data[0].avg);
        } else if (type_pred === "name only") {
            const params = new URLSearchParams();
            params.append("prenom", prenom);
            params.append("avg_age_deces", "true");

            const response = await fetch(url + `?${params}`);
            if (!response.ok) throw new Error("Failed to fetch average for prenom");
            const data = await response.json() as {avg: string}[];

            avg_expectancy = parseFloat(data[0].avg);
        } else {
            throw new Error("Invalid prediction type");
        }

        return avg_expectancy;
    } catch (err) {
        return Promise.reject(err instanceof Error ? err : new Error(String(err)));
    }
}



export { get_deces_year, get_deces_per_month, get_deces_per_year, get_prediction};