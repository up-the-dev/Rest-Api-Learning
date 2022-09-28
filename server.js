import express, { urlencoded } from "express"
import mongoose from "mongoose"
import { APP_PORT, DB_URL } from './config'
const mainRouter = require('./routes/index')
const errorHandlerMiddleWare = require('./middlewares/errorHandler.js')


const app = express()
app.listen(APP_PORT, () => {
    console.log(`server started at ${APP_PORT}`)
})
//db
async function dbConnection() {
    try {
        await mongoose.connect(DB_URL)
        console.log("DB connected")
    } catch (err) {
        throw err
    }
}
dbConnection()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/api', mainRouter)
app.use('/uploads', express.static('uploads'))

app.use(errorHandlerMiddleWare)