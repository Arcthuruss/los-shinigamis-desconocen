const url = "https://api:8000/deces"

type JSONResponse = {
    data?: {
        deces: Array<JSON>
    }
    errors?: Array<{ message: string }>
}

async function get_deces_year(year: number) {
    const params = new URLSearchParams();
    params.append("date_deces_start", `01-01-${year}`);
    params.append("date_deces_end", `31-12-${year}`);

    const response = await fetch(url + `?${params}`);

    const {data, errors}: JSONResponse = await response.json();

    if (response.ok) {
        return data;
    } else {
        const error = new Error(errors?.map((e) => e.message).join('\n') ?? 'unknown')
        return Promise.reject(error);
    }
}

export { get_deces_year };