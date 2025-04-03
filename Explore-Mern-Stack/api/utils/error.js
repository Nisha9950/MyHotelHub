export const errorHandler = (statusCode, message) => {
    const error = new Error(message);  // ✅ Directly set message in Error()
    error.status = statusCode;  // ✅ Use `error.status` instead of `statusCode`
    return error;
};
