import AttendanceTimelineChart from "./attendanceTimeline";
import AttendanceByMember from "./attendanceByMember";
import EventsMissingData from "./eventsMissingData";
import OrgPicker from "../GlobalData/orgPicker";
import ChangeInAttendance from "./changeInAttendance";
import ErrorNotification from "../GlobalData/errorNotification";

const ChartsTab = () => {
    return (
        <div className="card tabCard">
            <h2>Charts</h2>
            <OrgPicker />
            <ErrorNotification />
            <EventsMissingData />
            <AttendanceByMember />
            <ChangeInAttendance />
            <AttendanceTimelineChart />
        </div>
    );
};

export default ChartsTab;
