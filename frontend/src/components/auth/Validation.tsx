
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};


export const validatePassword = (password: string): boolean => {
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/;
    return password.length >= 8 && regex.test(password);
};



export const validateUsername = (username: string): boolean => {
    return username.length >= 3;
};

