const passwordValidations = (password) => {
    const passwordLength = password.length;
    if (passwordLength < 8) {
        return {
            message: "Password should be atleast 8 characters long",
            statusCode: 4001,
        };
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
    // if (!passwordRegex.test(password)) {
    //     return {
    //         message: "Password should contain atleast one lowercase, one uppercase, one number and one special character",
    //         statusCode: 4002,
    //     };
    // }
    return {
        message: "Password is valid",
        statusCode: 2000,
    };
};

module.exports = passwordValidations;