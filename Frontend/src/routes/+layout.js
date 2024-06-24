import { addTranslations, setLocale, setRoute } from '$lib/translations';

/** @type {import('@sveltejs/kit').Load} */
export const load = async ({ data}) => {
    // Get all variables from +layout.server.js and set them in the local variables
    const { i18n, translations, username, roleName, authToken } = data;
    const { locale, route } = i18n;
    const user = {username, roleName, authToken}

    addTranslations(translations);

    await setRoute(route);
    await setLocale(locale);

    return {i18n, user};
};