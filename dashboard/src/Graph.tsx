import {LineChart} from "reaviz";
import Select from "react-select";
import {useEffect, useState} from "react";
import {get_deces_per_month, get_deces_per_year} from "./data.ts";
import {pyrange} from "./small_util.ts";

export default function Graph() {

    const graphH = 300;
    const graphW = 600;

    const optionsYear = pyrange(2026, 1970).map(i => ({value: i, label: '' + i}))
    const optionsMonth = [
        {value: 1, label: "January"},
        {value: 2, label: "February"},
        {value: 3, label: "March"},
        {value: 4, label: "April"},
        {value: 5, label: "May"},
        {value: 6, label: "June"},
        {value: 7, label: "July"},
        {value: 8, label: "August"},
        {value: 9, label: "September"},
        {value: 10, label: "October"},
        {value: 11, label: "November"},
        {value: 12, label: "December"},
    ]
    const [dataYear, setDataYear] = useState<Array<{key: Date, data: number}>>([])
    const [dataMonth, setDataMonth] = useState<Array<{key: Date, data: number}>>([])
    const [dataAllYear, setDataAllYear] = useState<Array<{key: Date, data: number}>>([])
    const [dataAllMonth, setDataAllMonth] = useState<Array<{key: Date, data: number}>>([])
    const [selectedYear, setSelectedYear] = useState<{value: number, label: string}>({ value: 2010, label: '2010' });
    const [selectedMonth, setSelectedMonth] = useState<{value: number, label: string}>({ value: 1, label: 'January' });

    useEffect(() => {
        get_deces_per_month("all")
            .then(
                (data) => setDataAllYear(
                    data.map(obj => ({
                            key: new Date(`01/01/${obj.key}`),
                            data: obj.data,
                        })
                    )
                ),
                (err) => console.log(err)
            )
        get_deces_per_year("all")
            .then(
                (data) => setDataAllMonth(
                    data.map(obj => ({
                            key: new Date(`${obj.key}/01/2000`),
                            data: obj.data,
                        })
                    )
                ),
                (err) => console.log(err)
            )
    }, []);

    useEffect(() => {
        get_deces_per_month(selectedYear.value)
            .then(
                (data) => setDataYear(
                    data.map(obj => ({
                            key: new Date(`${obj.key}/01/${selectedYear.value}`),
                            data: obj.data,
                        })
                    )
                ),
                (err) => console.log(err)
            )
    }, [selectedYear])

    useEffect(() => {
        get_deces_per_year(selectedMonth.value)
            .then(
                (data) => setDataMonth(
                    data.map(obj => ({
                            key: new Date(`${selectedMonth.value}/01/${obj.key}`),
                            data: obj.data,
                        })
                    )
                ),
                (err) => console.log(err)
            )
    }, [selectedMonth])

    return (<>
        <main className="grid grid-cols-2 justify-around gap-4 pt-[4vh]">
            <div>
                <p>Deaths per month for a all years</p>
                <LineChart
                    height={graphH}
                    width={graphW}
                    data={dataAllMonth}
                />
            </div>
            <div>
                <p>Deaths per year for a all months</p>
                <LineChart
                    height={graphH}
                    width={graphW}
                    data={dataAllYear}
                />
            </div>
            <div>
                <p>Deaths per month for a select year</p>
                <div>
                    <Select
                        defaultValue={selectedYear}
                        //@ts-expect-error lib with fucked type
                        onChange={setSelectedYear}
                        options={optionsYear}
                        styles={{
                            menuList: (baseStyle) => ({
                                ...baseStyle,
                                color: "black"
                            })
                        }}
                    />
                </div>
                <LineChart
                    height={graphH}
                    width={graphW}
                    data={dataYear}
                />
            </div>
            <div>
                <p>Deaths per year for a select month</p>
                <div>
                    <Select
                        defaultValue={selectedMonth}
                        //@ts-expect-error lib with fucked type
                        onChange={setSelectedMonth}
                        options={optionsMonth}
                        styles={{
                            menuList: (baseStyle) => ({
                                ...baseStyle,
                                color: "black"
                            })
                        }}
                    />
                </div>
                <LineChart
                    height={graphH}
                    width={graphW}
                    data={dataMonth}
                />
            </div>
        </main>
    </>)
}