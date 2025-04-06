import Cookies from 'js-cookie';

/**
 * Sets a cookie with the given name, value, and options.
 * @param name - The name of the cookie.
 * @param value - The value of the cookie.
 * @param options - Optional settings for the cookie (e.g., expires, path, secure).
 */
export const setCookie = (name: string, value: string, options?: Cookies.CookieAttributes): void => {
    Cookies.set(name, value, options);
};

/**
 * Gets the value of a cookie by its name.
 * @param name - The name of the cookie.
 * @returns The value of the cookie, or undefined if the cookie does not exist.
 */
export const getCookie = (name: string): string | undefined => {
    return Cookies.get(name);
};

/**
 * Updates a cookie by setting it again with a new value and options.
 * @param name - The name of the cookie.
 * @param value - The new value of the cookie.
 * @param options - Optional settings for the cookie (e.g., expires, path, secure).
 */
export const updateCookie = (name: string, value: string, options?: Cookies.CookieAttributes): void => {
    Cookies.set(name, value, options);
};

/**
 * Deletes a cookie by its name.
 * @param name - The name of the cookie.
 * @param options - Optional settings for the cookie (e.g., path) to ensure proper deletion.
 */
export const deleteCookie = (name: string, options?: Cookies.CookieAttributes): void => {
    Cookies.remove(name, options);
};

/**
 * Clears all cookies by removing each one individually.
 */
export const clearAllCookies = (): void => {
    const allCookies = Cookies.get();
    Object.keys(allCookies).forEach(cookieName => {
        Cookies.remove(cookieName);
    });
};

export const getUrlParameters = (url: string): any => {
    // Create an empty object to store the parameters
    const params = {};

    // Extract the query string part of the URL
    const queryString = url.split('?')[1];

    // If there's no query string, return an empty object
    if (!queryString) {
        return params;
    }

    // Split the query string by '&' to get individual parameter pairs
    const paramPairs = queryString.split('&');

    // Loop through each parameter pair
    for (const pair of paramPairs) {
        // Split the pair by '=' to get key and value
        const [key, value] = pair.split('=');

        // Decode the key and value to handle URL encoding
        // and add them to the params object
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }

    return params;
}