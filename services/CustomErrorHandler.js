class CustomErrorHandler extends Error {
    constructor(status, msg) {
        super()
        this.status = status
        this.msg = msg
    }
    static alreadyExist(msg) {
        return new CustomErrorHandler(409, msg)
    }
    static wrongcredintials(msg = "username or password is wrong !") {
        return new CustomErrorHandler(401, msg)
    }
    static unAuthorized(msg = "unAuthorized") {
        return new CustomErrorHandler(401, msg)
    }
    static notFound(msg = "notFound") {
        return new CustomErrorHandler(404, msg)
    }
}
export default CustomErrorHandler