import AttendanceTimelineChart from "./attendanceTimeline";
import MemberAttendanceChart from "./attendanceByMember";

const ChartsTab = () => {
    return (
        <div className="card tabCard">
            <h2>Charts</h2>
            <MemberAttendanceChart />
            <AttendanceTimelineChart />
        </div>
    );
};

export default ChartsTab;
