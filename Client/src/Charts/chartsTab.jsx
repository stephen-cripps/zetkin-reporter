import AttendanceTimelineChart from "./attendanceTimeline";
import AttendanceByMember from "./attendanceByMember";
import EventsMissingData from "./eventsMissingData";
import OrgPicker from "../GlobalData/orgPicker";
import ChangeInAttendance from "./changeInAttendance";
import ErrorNotification from "../GlobalData/errorNotification";
import AttendanceTimelineGrouped from "./GroupedAttendanceTimeline";

const ChartsTab = () => {
    return (
        <div className="card tabCard">
            <h2>Charts</h2>
            <OrgPicker />
            <ErrorNotification />
            <EventsMissingData />
            <AttendanceByMember />
            <ChangeInAttendance />
            {/* <AttendanceTimelineChart /> */}
            <AttendanceTimelineGrouped />
        </div>
    );
};

export default ChartsTab;
