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



export { get_deces_year, get_deces_per_month, get_deces_per_year };