const baseUrl = process.env.REACT_APP_API_URL

async function getOrgs(cookie) {
  const baseUrl = process.env.REACT_APP_API_URL

  const response = await fetch(`${baseUrl}getorgs?cookie=${cookie}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch organizations: ${response.statusText}`);
  }

  return response.json();
}

async function getEvents(orgId, timeSpan, cookie) {
  const response = await fetch(
    `${baseUrl}GetActions?orgId=${orgId}&dateRangeMonths=${timeSpan}&cookie=${cookie}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.statusText}`);
  }

  return response.json();
}

export { getEvents, getOrgs };
