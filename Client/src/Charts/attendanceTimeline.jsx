import { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    Cell,
    LabelList
} from "recharts";
import { parseISO } from "date-fns";
import { useAppContext } from "../GlobalData/AppContext";

const COLORS = [
    "#1f78b4", "#33a02c", "#e31a1c", "#ff7f00",
    "#6a3d9a", "#b15928", "#a6cee3", "#b2df8a",
    "#fb9a99", "#fdbf6f", "#cab2d6", "#ffff99"
];

const AttendanceTimelineChart = () => {
    const { events } = useAppContext();

    const data = events.map((e) => {
        console.log(e)
        return ({
            name: e.title,
            date: parseISO(e.startTime).getTime(),
            attendees: e.participants.filter((p) => p.attendedStatus === 0).length,
            eventType: e.eventType
        });
    });

    const typeColorMap = useMemo(() => {
        const map = {};
        let colorIndex = 0;

        data.forEach((d) => {
            const type = d.eventType;
            if (!map[type]) {
                map[type] = COLORS[colorIndex % COLORS.length];
                colorIndex++;
            }
        });

        return map;
    }, [data]);

    // 1 day in ms
    const oneDay = 24 * 60 * 60 * 1000;

    const minDate = Math.min(...data.map((d) => d.date)) - oneDay;
    const maxDate = Math.max(...data.map((d) => d.date)) + oneDay;

    const renderLegend = (typeColorMap) => {
        const items = Object.entries(typeColorMap);
        return (
            <div style={{ display: "flex", gap: "15px", marginTop: "20px", flexWrap: "wrap" }}>
                {items.map(([type, color]) => (
                    <div key={type} style={{ display: "flex", alignItems: "center", fontSize: "14px" }}>
                        <div style={{
                            width: "14px",
                            height: "14px",
                            backgroundColor: color,
                            marginRight: "6px",
                            borderRadius: "3px"
                        }}></div>
                        {type}
                    </div>
                ))}
            </div>
        );
    };


    return (
        <div style={{ width: "100%" }}>
            <h2 style={{ textAlign: "center" }}>Event Engagement Timeline</h2>
            <BarChart
                width={window.innerWidth - 100}
                height={800}
                data={data}
                margin={{ top: 100, right: 30, left: 30, bottom: 100 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    type="number"
                    domain={[minDate, maxDate]}
                    tickFormatter={(unixTime) =>
                        new Date(unixTime).toLocaleDateString("en-GB", {
                            month: "short",
                            day: "numeric"
                        })
                    }
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    label={{ value: "Date", position: "insideBottom", offset: -5 }}
                />
                <YAxis
                    label={{
                        value: "Number of Attendees",
                        angle: -90,
                        position: "insideLeft"
                    }}
                />
                <Legend content={renderLegend(typeColorMap)} />                <Bar
                    dataKey="attendees"
                    name="Attendees"
                    barSize={8}
                    isAnimationActive={false}
                    activeBar={false}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={typeColorMap[entry.eventType] || "#8884d8"}
                        />
                    ))}
                    <LabelList
                        dataKey="name"
                        position="top"
                        style={{ fontSize: 10 }}
                        formatter={(value) => value}
                        content={(props) => {
                            const { x, y, value } = props;
                            return (
                                <text
                                    x={x}
                                    y={y}
                                    textAnchor="start"
                                    fontSize={12}
                                    transform={`rotate(-45, ${x}, ${y})`}
                                >
                                    {value}
                                </text>
                            );
                        }}
                    />
                </Bar>
            </BarChart>
        </div>
    );
};

export default AttendanceTimelineChart;
