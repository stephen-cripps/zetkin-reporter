import { useAppContext } from './AppContext';

const ErrorNotification = () => {
    const { error } = useAppContext();

    if (!error) {
        return null;
    }

    return (
        <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
            <strong>Error:</strong> {error}
        </div>
    );
}

export default ErrorNotification;