import { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
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

    const data = useMemo(() => {
        const grouped = {};

        events.forEach((e) => {
            const dateObj = parseISO(e.startTime);

            const day = new Date(
                dateObj.getFullYear(),
                dateObj.getMonth(),
                dateObj.getDate()
            ).getTime();

            const attendees = e.participants.filter(
                (p) => p.attendedStatus === 0
            );
            const count = attendees.length;
            const type = e.eventType;

            if (!grouped[day]) {
                grouped[day] = {
                    date: day,
                    attendeesByType: {},
                    details: []
                };
            }

            if (!grouped[day].attendeesByType[type]) {
                grouped[day].attendeesByType[type] = 0;
            }

            grouped[day].attendeesByType[type] += count;

            grouped[day].details.push({
                name: e.title,
                attendees,
                attendeesCount: count,
                eventType: type
            });
        });

        return Object.values(grouped).sort((a, b) => a.date - b.date);
    }, [events]);

    const eventTypes = useMemo(() => {
        return [...new Set(events.map((e) => e.eventType))];
    }, [events]);

    const typeColorMap = useMemo(() => {
        const map = {};
        let colorIndex = 0;

        eventTypes.forEach((type) => {
            map[type] = COLORS[colorIndex % COLORS.length];
            colorIndex++;
        });

        return map;
    }, [eventTypes]);

    const oneDay = 24 * 60 * 60 * 1000;

    const minDate =
        data.length > 0
            ? Math.min(...data.map((d) => d.date)) - oneDay
            : 0;

    const maxDate =
        data.length > 0
            ? Math.max(...data.map((d) => d.date)) + oneDay
            : 0;

    const daysTotal = (maxDate - minDate) / oneDay;

    const renderLegend = () => (
        <div
            style={{
                display: "flex",
                gap: "15px",
                marginTop: "20px",
                flexWrap: "wrap"
            }}
        >
            {eventTypes.map((type) => (
                <div
                    key={type}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "14px"
                    }}
                >
                    <div
                        style={{
                            width: "14px",
                            height: "14px",
                            backgroundColor: typeColorMap[type],
                            marginRight: "6px",
                            borderRadius: "3px"
                        }}
                    ></div>
                    {type}
                </div>
            ))}
        </div>
    );

    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload || !payload.length) return null;

        const data = payload[0].payload;

        return (
            <div className="custom-tooltip">
                <Card>
                    <CardBody>
                        <h3>
                            {new Date(data.date).toLocaleDateString("en-GB")}
                        </h3>

                        {data.details.map((event, idx) => (
                            <div key={idx} style={{ marginBottom: "10px" }}>
                                <strong>{event.name}</strong>
                                <p>
                                    {event.attendeesCount} confirmed attendees
                                </p>
                            </div>
                        ))}
                    </CardBody>
                </Card>
            </div>
        );
    };


    return (
        <div style={{ width: "100%", border: "1px solid #ccc", borderRadius: "8px", marginBottom: "20px" }}>
            <h2 style={{ textAlign: "center" }}>
                Event Engagement Timeline
            </h2>
            <i style={{ marginLeft: "20px" }}>I've made an attempt to group this by type so we can handle things happening on the same day. I don't have access to real data so this might look awful if there are a lot of event types. It looks kind of awful anyway. Sorry.</i>

            <div style={{ overflowX: "auto" }}>
                <BarChart
                    width={daysTotal < 90 ? window.innerWidth - 100 : daysTotal * 20}
                    height={800}
                    data={data}
                    margin={{ top: 100, right: 30, left: 30, bottom: 100 }}
                    barCategoryGap="3%"   // spacing between groups
                    barGap={0}             // spacing between bars in group
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
                        tickCount={20}
                    />

                    <YAxis />

                    <Legend content={renderLegend} />
                    <Tooltip content={<CustomTooltip />} />

                    {/* ✅ GROUPED (side-by-side) bars */}
                    {eventTypes.map((type) => (
                        <Bar
                            key={type}
                            barSize={20}   // 👈 IMPORTANT
                            dataKey={`attendeesByType.${type}`}
                            fill={typeColorMap[type]}
                            name={type}
                            isAnimationActive={false}
                        />
                    ))}

                </BarChart>
            </div>
        </div>
    );
};

export default AttendanceTimelineChart;