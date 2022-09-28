import joi from 'joi'
import { User, RefreshToken } from '../../models'
import JwtService from '../../services/JwtService'
import CustomErrorHandler from '../../services/CustomErrorHandler'
import { REFRESH_SECRET } from '../../config'
import bcrypt from 'bcrypt'
const registerController = {
    //validation
    async register(req, res, next) {
        const registerSchema = joi.object(
            {
                name: joi.string().min(3).max(30).required(),
                email: joi.string().email().required(),
                password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{4,30}$')).required(),
                repeat_password: joi.ref('password')
            }
        )

        const { error } = registerSchema.validate(req.body)
        if (error) {
            return next(error)
        }

        //checking if email already exist in database
        try {
            const exist = await User.exists({ email: req.body.email })
            if (exist) {
                return next(CustomErrorHandler.alreadyExist("Email already exist."));
            }

        } catch (err) {
            return next(err)
        }

        //generating a hash
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        //setting schema values(model preparation)
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        //saving it
        let access_token;
        let refresh_token;
        try {
            const result = await user.save();
            // creating and sending jwt token 
            access_token = JwtService.sign({ _id: result._id, email: result.email, role: result.role })
            refresh_token = JwtService.sign({ _id: result._id, email: result.email, role: result.role }, REFRESH_SECRET, '1y')
            //saving refresh token to db in model named RefreshToken


            await RefreshToken.create({ token: refresh_token })





        } catch (err) {
            return next(err)
        }

        res.send({ access_token, refresh_token })
    }
}
export default registerController;