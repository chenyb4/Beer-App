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
        {
            locale: 'en',
            key: 'credits',
            routes: ['/credits'],
            loader: async () => (await import('./en/credits.json')).default,
        },
        {
            locale: 'nl',
            key: 'credits',
            routes: ['/credits'],
            loader: async () => (await import('./nl/credits.json')).default,
        },
        {
            locale: 'en',
            key: 'drinks',
            routes: ['/drinks'],
            loader: async () => (await import('./en/drinks.json')).default,
        },
        {
            locale: 'nl',
            key: 'drinks',
            routes: ['/drinks'],
            loader: async () => (await import('./nl/drinks.json')).default,
        },
        {
            locale: 'en',
            key: 'administration',
            routes: ['/administration'],
            loader: async () => (await import('./en/administration.json')).default,
        },
        {
            locale: 'nl',
            key: 'administration',
            routes: ['/administration'],
            loader: async () => (await import('./nl/administration.json')).default,
        },
        {
            locale: 'en',
            key: 'inventory_history',
            routes: ['/inventory_history'],
            loader: async () => (await import('./en/inventory_history.json')).default,
        },
        {
            locale: 'nl',
            key: 'inventory_history',
            routes: ['/administration'],
            loader: async () => (await import('./nl/inventory_history.json')).default,
        },
        {
            locale: 'en',
            key: 'inventory_management',
            routes: ['/inventory_management'],
            loader: async () => (await import('./en/inventory_management.json')).default,
        },
        {
            locale: 'nl',
            key: 'inventory_management',
            routes: ['/inventory_management'],
            loader: async () => (await import('./nl/inventory_management.json')).default,
        },
        {
            locale: 'en',
            key: 'transactions_history',
            routes: ['/transactions_history'],
            loader: async () => (await import('./en/transactions_history.json')).default,
        },
        {
            locale: 'nl',
            key: 'transactions_history',
            routes: ['/transactions_history'],
            loader: async () => (await import('./nl/transactions_history.json')).default,
        },
    ],
};

export const { t, loading, locales, locale, translations, loadTranslations, addTranslations, setLocale, setRoute } = new i18n(config);

loading.subscribe(($loading) => $loading && console.log('Loading translations...'));