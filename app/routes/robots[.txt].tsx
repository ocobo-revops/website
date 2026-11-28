function generateRobotsTxt() {
  return [
    'User-agent: *',
    'Allow: /',
    'Sitemap: https://www.ocobo.co/sitemap.xml',
  ].join('\n');
}

export async function loader() {
  return new Response(generateRobotsTxt(), {
    headers: {
      'content-type': 'text/plain',
    },
  });
}
