export const getWidth = (length) => {
    if (length > 20) {
        return length * 50;
    } else {
        return window.innerWidth - 100;
    }
};