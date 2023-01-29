import astroConfig from '../../astro.config.mjs';

const isProd = process.env.NODE_ENV === 'production';

const appSettings = {
  siteRoot: astroConfig.base,
  resourceRoot: isProd ? astroConfig.base : ''
};

export const AppSettings = appSettings;
