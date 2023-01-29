const siteBase = '/portfolio';
const isProd = process.env.NODE_ENV === 'production';

export const AppSettings = {
  siteRoot: siteBase,
  resourceRoot: isProd ? siteBase : ''
};
