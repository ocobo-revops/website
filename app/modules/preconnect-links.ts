export type PreconnectLink = {
  rel: 'preconnect' | 'dns-prefetch';
  href: string;
  crossOrigin?: 'anonymous';
};

export const GITHUB_RAW_HOST = 'https://raw.githubusercontent.com';

export function getPreconnectLinks(
  contentSource: 'locale' | 'github',
  fontsCdnHost?: string,
): PreconnectLink[] {
  const links: PreconnectLink[] = [];

  if (fontsCdnHost) {
    links.push(
      { rel: 'preconnect', href: fontsCdnHost, crossOrigin: 'anonymous' },
      { rel: 'dns-prefetch', href: fontsCdnHost },
    );
  }

  if (contentSource === 'github') {
    links.push(
      { rel: 'preconnect', href: GITHUB_RAW_HOST, crossOrigin: 'anonymous' },
      { rel: 'dns-prefetch', href: GITHUB_RAW_HOST },
    );
  }

  return links;
}
