async function getEvents() {

    // ToDo: Make URL come from env
    // ToDo: Sort out https
    // ToDO: Handle Errors
    const response = await fetch(` http://localhost:5159/api/zetkin/all-actions`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    return response.json();
}

export { getEvents };