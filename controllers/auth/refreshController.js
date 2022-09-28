import joi from 'joi'
import { REFRESH_SECRET } from '../../config'
import { RefreshToken, User } from '../../models'
import CustomErrorHandler from '../../services/CustomErrorHandler'
import JwtService from '../../services/JwtService'
const refreshController = {
    async refresh(req, res, next) {
        //syntax validation
        const refreshSchema = joi.object({
            refresh_token: joi.string().required()
        })
        const { error } = refreshSchema.validate(req.body)
        if (error) {
            return next(error)
        }

        //database validation in token model

        try {
            const refreshtoken = await RefreshToken.findOne({ token: req.body.refresh_token })
            if (!refreshtoken) {
                return next(CustomErrorHandler.unAuthorized("invalid refresh token"))
            }
            //validation of token
            let userId;
            try {
                const { _id } = await JwtService.verify(refreshtoken.token, REFRESH_SECRET)
                userId = _id
            } catch (err) {
                return next(CustomErrorHandler.unAuthorized("invalid refresh token"))
            }

            //database validation in user model
            const user = await User.findOne({ _id: userId })
            if (!user) {
                return next(CustomErrorHandler.unAuthorized("No user found"))
            }
            let access_token = await JwtService.sign({ _id: user._id, email: user.email, role: user.role })
            let refresh_token = await JwtService.sign({ _id: user._id, email: user.email, role: user.role }, REFRESH_SECRET, '1y')

            await RefreshToken.create({ token: refresh_token })
            //sending tokens
            res.send({ access_token, refresh_token })




        } catch (err) {
            return next(err)
        }



    }
}
export default refreshController