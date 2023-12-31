export default function createURL(path: string) {
  const IS_SERVER = typeof window === 'undefined';
  const siteUrl =
    process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_SITE_URL_DEVELOPMENT
      : process.env.NEXT_PUBLIC_SITE_URL_PRODUCTION;
  const baseURL = IS_SERVER ? siteUrl : window.location.origin;
  return new URL(path, baseURL).toString();
}
