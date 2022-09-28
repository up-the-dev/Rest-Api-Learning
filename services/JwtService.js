import Jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config'
class JwtService {

    static sign(payload, secret = JWT_SECRET, expiry = '600s') {
        return Jwt.sign(payload, secret, { expiresIn: expiry })
    }
    static verify(token, secret = JWT_SECRET) {
        return Jwt.verify(token, secret)
    }

}
export default JwtService