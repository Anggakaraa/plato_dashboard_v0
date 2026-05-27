export const AUTH_USER = "authUser";

export const decodeToken = (token) => {
    if (!token) return null;


    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

export const getDecodedToken = () => {
    return decodeToken(getToken());
}

export const getToken = () => {
    const token = localStorage.getItem(AUTH_USER);
    return token;
}

export const containsToken = () => {
    const token = getToken();
    return token !== undefined && token !== null;  
}

export const setToken = (token) => {
    localStorage.setItem(AUTH_USER, token);
}

export const removeToken = () => {
    console.log('removing token')
    localStorage.removeItem(AUTH_USER);
}
