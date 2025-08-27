import AttendanceTimelineChart from "./attendanceTimeline";
import MemberAttendanceChart from "./attendanceByMember";

const ChartsTab = ({ events }) => {
    return (
        <div className="card tabCard">
            <h2>Charts</h2>
            <MemberAttendanceChart events={events} />
            <AttendanceTimelineChart events={events} />
        </div>
    );
};

export default ChartsTab;
