import {locales, loadTranslations, translations, defaultLocale} from '$lib/translations';
import {redirect} from "@sveltejs/kit";

/** @type {import('@sveltejs/kit').ServerLoad} */
export const load = async ({url, cookies, request}) => {
    const {pathname} = url;

    // Get roleName and jwt token to determine login handling
    let roleName = (cookies.get('roleName') || '');
    let authToken = (cookies.get('authToken') || '');

    // When not on the login page, check if user has authentication
    if (pathname !== "/login") {
        if (!authToken || authToken === '') {
            // When user is not logged in, redirect to login page with notification
            throw redirect(302, '/login?status=302');
        } else {
            // When user is logged in as seller, make sure user stays in drinks page
            if (roleName === "seller" && (pathname !== "/" && pathname !== "/drinks" && pathname !== '/drinks?status=302')) {
                throw redirect(302, '/drinks?status=302');
            }
        }
    }

    // Try to get the locale from cookie
    let locale = (cookies.get('lang') || '').toLowerCase();
    let username = (cookies.get('username') || '');

    // Get user preferred locale
    if (!locale) {
        locale = `${`${request.headers.get('accept-language')}`.match(/[a-zA-Z]+?(?=-|_|,|;)/)}`.toLowerCase();
    }

    // Get defined locales
    const supportedLocales = locales.get().map((l) => l.toLowerCase());

    // Use default locale if current locale is not supported
    if (!supportedLocales.includes(locale)) {
        locale = defaultLocale;
    }

    await loadTranslations(locale, pathname); // keep this just before the `return`

    return {
        i18n: {locale, route: pathname},
        translations: translations.get(), // `translations` on server contain all translations loaded by different clients
        username,
        roleName,
        authToken
    };
};