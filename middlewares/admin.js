import { User } from "../models"
import CustomErrorHandler from "../services/CustomErrorHandler"

const admin = async (req, res, next) => {
    //fetch user
    try {
        const user = await User.findOne({ _id: req.user._id })
        //check if role of user is admin
        if (user.role == 'admin') {
            next()
        } else {
            return next(CustomErrorHandler.unAuthorized('You are not admin'))
        }
    } catch (err) {
        return next(err)

    }


}
export default admin