const siteBase = '/portfolio';
const isProd = process.env.NODE_ENV === 'production';

export const SITE_ROOT = '/portfolio';
export const RESOURCE_ROOT = isProd ? siteBase : '';
export const SITE_TITLE = 'Scott Vossen';
export const SITE_DESCRIPTION = 'Scott Vossen Software Engineer Portfolio.';
