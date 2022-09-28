import joi from 'joi'
const productSchema = joi.object({
    name: joi.string().required(),
    price: joi.number().required(),
    size: joi.string().required(),
    image: joi.string()

})
export default productSchema