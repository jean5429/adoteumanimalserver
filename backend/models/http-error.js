class HttpError extends Error {
    constructor(message, errorCode) {
        super(message); //Add a message property to Error class
        this.code = errorCode; // Adds a code property to Error class
    }
}

module.exports = HttpError;
