export const getWidth = (length) => {
    console.log(window.innerWidth);
    if (length > 20) {
        return length * 50;
    } else {
        return window.innerWidth - 100;
    }
};