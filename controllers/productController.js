import joi from 'joi'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { Product } from '../models';
import CustomErrorHandler from '../services/CustomErrorHandler';
import productSchema from '../validator/productvalidator'

let fileuniqueName;
const storage = multer.diskStorage({
    destination: (req, file, cl) => {
        cl(null, 'uploads/')

    },
    filename: (req, file, cl) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
        fileuniqueName = uniqueName
        cl(null, uniqueName)
    }
})

const formdataHandler = multer(
    {
        storage,
        limits: { fileSize: 1000000 * 5 }
    }
).single('image');


const productController = {
    async store(req, res, next) {
        //multipart form data
        formdataHandler(req, res, async (err) => {
            if (err) {
                return next(err)
            }
            const filePath = req.file.path
            const { error } = productSchema.validate(req.body)
            if (error) {
                fs.unlink(path.resolve('uploads/', fileuniqueName), (err) => {
                    return next(err)
                })
                return next(error)
            }
            console.log(req.file)
            let document
            try {
                document = await Product.create({
                    name: req.body.name,
                    price: req.body.price,
                    size: req.body.size,
                    image: filePath
                })
            } catch (err) {
                return next(err)
            }

            res.status(200).json(document)

        })


    },

    async update(req, res, next) {
        formdataHandler(req, res, async (err) => {
            if (err) {
                return next(err)
            }
            let filePath
            const { error } = productSchema.validate(req.body)
            if (error) {
                return next(error)
            }
            let document;
            try {
                document = await Product.findOneAndUpdate({ _id: req.params.id }, {
                    name: req.body.name,
                    price: req.body.price,
                    size: req.body.size,
                    ...(req.file && { image: req.file.path })
                })

            } catch (err) {
                return next(err)
            }
            res.status(201).json(document)

        })
    },

    async delete(req, res, next) {
        try {
            //delete product
            const document = await Product.findOneAndRemove({ _id: req.params.id })
            if (!document) {
                return next(new Error("resourse not found"))
            }

            //delete image from server
            const filepath = document._doc.image

            fs.unlink(filepath, (err) => {
                if (err) {
                    return next(err)
                }
                res.send(document)
            })

        } catch (err) {
            return next(err)
        }
    },

    async getAll(req, res, next) {
        let documents
        try {
            documents = await Product.find().select('-__v -updatedAt')
            if (!documents) {
                return next(CustomErrorHandler.notFound('resourse not found'))
            }

        } catch (err) {
            return next(err)
        }
        res.send(documents)
    },

    async getOne(req, res, next) {
        let document
        try {
            document = await Product.findOne({ _id: req.params.id }).select('-__v -updatedAt')
            if (!document) {
                return next(new Error('Resourse not found'))
            }
            res.send(document)

        } catch (err) {
            return next(err)
        }
    }
}
export default productController