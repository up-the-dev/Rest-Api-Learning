import { RefreshToken, User } from "../../models"
import CustomErrorHandler from "../../services/CustomErrorHandler"
import bcrypt from 'bcrypt'
import Joi from "joi"
import JwtService from "../../services/JwtService"
import { REFRESH_SECRET } from "../../config"

const loginController = {

    async login(req, res, next) {

        //validation
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(
                new RegExp('^[a-zA-Z0-9]{4,30}$')).required()
        })
        const { error } = loginSchema.validate(req.body)
        if (error) {
            return next(error)
        }


        //checking is user registered
        let user;
        let access_token;
        let refresh_token;
        try {
            user = await User.findOne({ email: req.body.email })
            if (!user) {
                return next(CustomErrorHandler.wrongcredintials("Email is not registered. please register First!"))
            }

            //varifying password
            const match = await bcrypt.compare(req.body.password, user.password)
            if (!match) {
                return next(CustomErrorHandler.wrongcredintials("wrong Password"))
            }

            // creating and sending jwt token
            access_token = JwtService.sign({ _id: user._id, email: user.email, role: user.role })
            refresh_token = JwtService.sign({ _id: user._id, email: user.email, role: user.role }, REFRESH_SECRET, '1y')
            //saving refresh token to db in model named RefreshToken


            await RefreshToken.create({ token: refresh_token })


        } catch (err) {
            return next(err)
        }





        res.send({ access_token, refresh_token })
    },

    async logout(req, res, next) {
        //validation
        const logoutSchema = Joi.object({
            refresh_token: Joi.string().required()
        })
        const { error } = logoutSchema.validate(req.body)
        if (error) {
            return next(error)
        }

        //deletion of refresh token
        try {
            await RefreshToken.deleteOne({ token: req.body.refresh_token })
        } catch (err) {
            return next(new Error('Database Error'))
        }
        res.send({ status: 1 })
    }
}
export default loginController