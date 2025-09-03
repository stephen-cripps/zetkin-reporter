// ToDo: Make URL come from env
// ToDo: Sort out https
// ToDO: Handle Errors

async function getOrgs() {
  const response = await fetch(`http://localhost:5159/api/zetkin/orgs`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch organizations: ${response.statusText}`);
  }

  return response.json();
}

async function getEvents(orgId, timeSpan) {
  const response = await fetch(
    ` http://localhost:5159/api/zetkin/all-actions?orgId=${orgId}&dateRangeMonths=${timeSpan}`,
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
