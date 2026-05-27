export const FIRST_ACCESS = "firstAccess";

export const setFirstAccess = (value) => {
    if (!value) return;
    
    localStorage.setItem(FIRST_ACCESS, value);
}

export const removeFirstAccess = () => {
    localStorage.removeItem(FIRST_ACCESS);
}

export const getFirstAccess = () => {
    const value = localStorage.getItem(FIRST_ACCESS);
    if (!value) return false;
    
    return value;
}
