import React, { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Cell,
    LabelList
} from "recharts";

const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 65%, 50%)`;
};

const MemberAttendanceChart = ({ events }) => {
    const attendanceMap = {};

    events.forEach((e) => {
        e.participants.forEach((p) => {
            if (p.attendedStatus === 0) {
                const id = p.person.id;
                if (!attendanceMap[id]) {
                    attendanceMap[id] = {
                        id,
                        name: p.person.name,
                        count: 0
                    };
                }
                attendanceMap[id].count += 1;
            }
        });
    });

    const data = Object.values(attendanceMap).sort((a, b) => b.count - a.count);

    const interpolateColor = (value, min, max) => {
        // Linear interpolation: light blue (#a6cee3) → dark blue (#1f78b4)
        const ratio = (value - min) / (max - min || 1); // avoid div by zero
        const r = Math.round(166 + (31 - 166) * ratio);
        const g = Math.round(206 + (120 - 206) * ratio);
        const b = Math.round(227 + (180 - 227) * ratio);
        return `rgb(${r},${g},${b})`;
    };

    const counts = data.map((d) => d.count);
    const minCount = Math.min(...counts);
    const maxCount = Math.max(...counts);

    return (
        <div style={{ width: "100%" }}>
            <h2 style={{ textAlign: "center" }}>Participant Attendance</h2>
            <BarChart
                width={window.innerWidth}
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
                    dataKey="count"
                    barSize={20}
                    isAnimationActive={false}
                    activeBar={false}
                >
                    {data.map((entry) => (
                        <Cell
                            key={entry.id}
                            fill={interpolateColor(entry.count, minCount, maxCount)} />
                    ))}
                    <LabelList
                        dataKey="count"
                        position="top"
                        style={{ fontSize: 12 }}
                    />
                </Bar>
            </BarChart>
        </div>
    );
};

export default MemberAttendanceChart;
