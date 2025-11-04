async function getOrgs(cookie) {
  const response = await fetch(`http://localhost:5159/api/zetkin/orgs?cookie=${cookie}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch organizations: ${response.statusText}`);
  }

  return response.json();
}

async function getEvents(orgId, timeSpan, cookie) {
  const response = await fetch(
    ` http://localhost:5159/api/zetkin/all-actions?orgId=${orgId}&dateRangeMonths=${timeSpan}&cookie=${cookie}`,
    {
      method: 'GET',
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.statusText}`);
  }

  return response.json();
}

export { getEvents, getOrgs };
