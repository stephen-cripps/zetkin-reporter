import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Cell,
    LabelList
} from "recharts";
import usePeopleFromEvents from "../GlobalData/usePeopleFromEvents";

const AttendanceByMember = () => {
    const people = usePeopleFromEvents();
    const data = [...people].sort((a, b) => b.attended - a.attended);

    const interpolateColor = (value, min, max) => {
        // Linear interpolation: light blue (#a6cee3) → dark blue (#1f78b4)
        const ratio = (value - min) / (max - min || 1); // avoid div by zero
        const r = Math.round(166 + (31 - 166) * ratio);
        const g = Math.round(206 + (120 - 206) * ratio);
        const b = Math.round(227 + (180 - 227) * ratio);
        return `rgb(${r},${g},${b})`;
    };

    const counts = data.map((d) => d.attended);
    const minCount = Math.min(...counts);
    const maxCount = Math.max(...counts);

    return (
        <div style={{ width: "100%" }}>
            <h2 style={{ textAlign: "center" }}>Member Engagement</h2>
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
                        value: "Events Attended",
                        angle: -90,
                        position: "insideLeft"
                    }}
                />
                <Bar
                    dataKey="attended"
                    barSize={20}
                    isAnimationActive={false}
                    activeBar={false}
                >
                    {data.map((entry) => (
                        <Cell
                            key={entry.id}
                            fill={interpolateColor(entry.attended, minCount, maxCount)} />
                    ))}
                    <LabelList
                        dataKey="attended"
                        position="top"
                        style={{ fontSize: 12 }}
                    />
                </Bar>
            </BarChart>
        </div>
    );
};

export default AttendanceByMember;
