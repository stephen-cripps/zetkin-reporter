import { useEffect, useState } from 'react';
import { useAppContext } from '../GlobalData/AppContext';
import usePeopleFromEvents from '../GlobalData/usePeopleFromEvents';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Cell,
    LabelList
} from "recharts";

const ChangeInAttendance = () => {

    const people = usePeopleFromEvents();

    const { timeSpan } = useAppContext();

    const [data, setData] = useState([]);
    const [minCount, setMinCount] = useState(0);
    const [maxCount, setMaxCount] = useState(0);

    useEffect(() => {
        const now = new Date();
        const pastPeriodStart = new Date();
        pastPeriodStart.setMonth(pastPeriodStart.getMonth() - timeSpan / 2);
        const prevPeriodStart = new Date();
        prevPeriodStart.setMonth(prevPeriodStart.getMonth() - timeSpan);

        let changeData = people
            .filter(person => person.attended > 0)
            .map(person => {
                const pastPeriodAttendance = person.eventsAttended.filter(event => new Date(event.startTime) >= pastPeriodStart && new Date(event.startTime) <= now).length;
                const prevPeriodAttendance = person.eventsAttended.filter(event => new Date(event.startTime) >= prevPeriodStart && new Date(event.startTime) < pastPeriodStart).length;

                const change = pastPeriodAttendance - prevPeriodAttendance;

                return {
                    personId: person.id,
                    name: person.name,
                    change: change,
                };
            });

        const counts = data.map((d) => d.change);
        setMinCount(Math.min(...counts));
        setMaxCount(Math.max(...counts));

        changeData = changeData.sort((a, b) => b.change - a.change);

        setData(changeData);

    }, [people, timeSpan]);

    // AI Generated because I'm  lazy. Sorry.
    const interpolateColor = (value, min, max) => {
        // Diverging scale:
        // - Negative values: light red (near 0) -> dark red (most negative)
        // - Positive values: light blue (near 0) -> dark blue (most positive)
        const clamp01 = (v) => Math.max(0, Math.min(1, v));

        const lightBlue = [166, 206, 227]; // #a6cee3
        const darkBlue = [31, 120, 180];   // #1f78b4
        const lightRed = [255, 204, 204];  // #ffcccc
        const darkRed = [139, 0, 0];       // #8B0000

        const lerp = (a, b, t) => Math.round(a + (b - a) * t);
        const lerpColor = (c1, c2, t) => `rgb(${lerp(c1[0], c2[0], t)},${lerp(c1[1], c2[1], t)},${lerp(c1[2], c2[2], t)})`;

        // Mixed negative and positive values: split around zero
        if (value > 0) {
            const ratio = clamp01(value / (max || 1));
            return lerpColor(lightBlue, darkBlue, ratio);
        }

        // value < 0
        const ratio = clamp01(value / (min || 1)); // both negative -> ratio in (0..1]
        return lerpColor(lightRed, darkRed, ratio);
    };

    return (
        <div>
            <h2 style={{ textAlign: "center" }}>Change in Attendance between past {timeSpan / 2} months and previous {timeSpan / 2} months</h2>
            <BarChart
                width={window.innerWidth - 100}
                height={800}
                data={data}
                margin={{ top: 100, right: 30, left: 30, bottom: 150 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    interval={0} // show all names, even if many
                    label={{ value: "Participants", position: "insideBottom", offset: -5 }}
                />
                <YAxis
                    allowDecimals={false}
                    label={{
                        value: "Change in Attendance",
                        angle: -90,
                        position: "insideLeft"
                    }}
                />
                <Bar
                    dataKey="change"
                    barSize={20}
                    isAnimationActive={false}
                    activeBar={false}
                >
                    {data.map((entry) => {
                        return (
                            <Cell
                                key={entry.id}
                                fill={interpolateColor(entry.change, minCount, maxCount)} />
                        );
                    })}
                    <LabelList
                        dataKey="attended"
                        position="top"
                        style={{ fontSize: 12 }}
                    />
                </Bar>
            </BarChart>
        </div>
    );
}

export default ChangeInAttendance;