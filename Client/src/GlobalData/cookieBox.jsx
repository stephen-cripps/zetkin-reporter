import { useAppContext } from './AppContext';

const CookieBox = () => {
    const { setCookie } = useAppContext();

    return (
        <div>
            <p>Enter your Zetkin Cookie (Submitting blank text will return test data)</p>
            <p>(I'll implement a less janky auth method when Zetkin set me up with an OAuth client)</p>
            <p>If things start acting weird, the cookie's probably expired and you need to grab a fresh one</p>
            <p> To grab your cookie, log into Zetkin Organise, hit F12 to open dev tools then select the "Network tab". Navigate to another page within organise and you'll see a bunch of requests appearing. Select one and you should see a "Cookie" under the request headers. Right click that, copy value and paste it into here.</p>
            <div className="row">
                <div className="col-3">
                    <div className="input-group mb-3">
                        <input className='form-control' type="text" id="cookieInput" placeholder="Enter cookie here" />
                        <button className='btn btn-primary' onClick={() => {
                            const cookieValue = document.getElementById("cookieInput").value;
                            setCookie(cookieValue);
                        }}>Submit Cookie</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CookieBox;