import i18n from 'sveltekit-i18n';
import { dev } from '$app/environment';
import lang from './lang.json';

export const defaultLocale = 'en';

/** @type {import('sveltekit-i18n').Config} */
export const config = {
    log: {
        level: dev ? 'warn' : 'error',
    },
    translations: {
        en: { lang },
        nl: { lang },
    },
    loaders: [
        {
            locale: 'en',
            key: 'homepage',
            routes: ['/'],
            loader: async () => (await import('./en/homepage.json')).default,
        },
        {
            locale: 'nl',
            key: 'homepage',
            routes: ['/'],
            loader: async () => (await import('./nl/homepage.json')).default,
        },
    ],
};

export const { t, loading, locales, locale, translations, loadTranslations, addTranslations, setLocale, setRoute } = new i18n(config);

loading.subscribe(($loading) => $loading && console.log('Loading translations...'));