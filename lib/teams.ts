export async function postTeamsMessage(title: string, text: string) {
  const url = process.env.TEAMS_WEBHOOK_URL;
  if (!url) return;
  const payload = {
    '@type': 'MessageCard',
    '@context': 'https://schema.org/extensions',
    summary: title,
    themeColor: '0072C6',
    title,
    text,
  };
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {}
}



