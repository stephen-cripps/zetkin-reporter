import AttendanceTimelineChart from "./attendanceTimeline";
import AttendanceByMember from "./attendanceByMember";

const ChartsTab = () => {
    return (
        <div className="card tabCard">
            <h2>Charts</h2>
            <AttendanceByMember />
            <AttendanceTimelineChart />
        </div>
    );
};

export default ChartsTab;
