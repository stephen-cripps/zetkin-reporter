import { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    Cell,
    Tooltip
} from "recharts";
import { parseISO } from "date-fns";
import { useAppContext } from "../GlobalData/AppContext";
import { Card, CardBody } from "react-bootstrap";

const COLORS = [
    "#1f78b4", "#33a02c", "#e31a1c", "#ff7f00",
    "#6a3d9a", "#b15928", "#a6cee3", "#b2df8a",
    "#fb9a99", "#fdbf6f", "#cab2d6", "#ffff99"
];

const AttendanceTimelineChart = () => {
    const { events } = useAppContext();

    const data = events.map((e) => {
        return ({
            name: e.title,
            date: parseISO(e.startTime).getTime(),
            attendees: e.participants.filter((p) => p.attendedStatus === 0),
            attendeesCount: e.participants.filter((p) => p.attendedStatus === 0).length,
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

    const CustomTooltip = ({ active, payload, label }) => {
        const isVisible = active && payload && payload.length;

        const ttData = payload[0]?.payload

        return (
            <div className="custom-tooltip" style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
                {isVisible && (
                    <Card >
                        <CardBody>
                            <h3>{ttData.name}</h3>
                            <p>{new Date(ttData.date).toLocaleDateString("en-GB")}</p>
                            <p>{`${ttData.attendeesCount} confirmed attendees`}</p>
                            <ul>
                                {ttData.attendees.map((attendee) => (
                                    <li key={attendee.person.id}>{attendee.person.name}</li>
                                ))}
                            </ul>
                        </CardBody>
                    </Card>
                )}
            </div>
        );
    };

    console.log("Chart data:", data);


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
                            year: "2-digit",
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
                <Legend content={renderLegend(typeColorMap)} />
                <Bar
                    dataKey="attendeesCount"
                    name="Attendees"
                    barSize={8}
                    isAnimationActive={false}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={typeColorMap[entry.eventType] || "#8884d8"}
                            defaultIndex={0}
                        />
                    ))}
                    <Tooltip
                        animationDuration={100}
                        content={CustomTooltip}
                    />
                </Bar>
            </BarChart>
        </div>
    );
};

export default AttendanceTimelineChart;
