import { useAppContext } from '../GlobalData/AppContext';
import cookieImage from '../assets/cookie_instructions.png';

const CookieTab = () => {
    const { setCookie, setActiveTab } = useAppContext();

    return (
        <div className="card tabCard">
            <p>Until Zetkin give me OAuth access, we have to use this Janky way to log in (sorry - they've stopped replying to my emails :( )</p>
            <p>If things start acting weird, the cookie's probably expired and you need to grab a fresh one</p>
            <p> To grab your cookie, log into Zetkin Organise, hit F12 to open dev tools then select the "Network" tab. Navigate to another page within organise and you'll see a bunch of requests appearing.
                Select one and you should see a "Cookie" under the request headers. Right click that, copy value and paste it into here.</p>
            <div className="row">
                <div className="col-3">
                    <div className="input-group mb-3">
                        <input className='form-control' type="text" id="cookieInput" placeholder="Enter cookie here" />
                        <button className='btn btn-primary' onClick={() => {
                            const cookieValue = document.getElementById("cookieInput").value;
                            setCookie(cookieValue);
                            setActiveTab('charts')
                        }}>Submit Cookie</button>
                    </div>
                </div>
            </div>
            <p>Here's what that looks like in Firefox:</p>
            <img src={cookieImage} alt="Instructions for grabbing the cookie" width='50%'></img>
        </div>
    );
}

export default CookieTab;