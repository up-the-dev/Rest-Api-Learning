const router = require('express').Router()
import { registerController, loginController, userController, refreshController, productController } from '../controllers'
import auth from '../middlewares/auth.js'
import admin from '../middlewares/admin.js'

router.post('/register', registerController.register)

router.post('/login', loginController.login)

router.get('/me', auth, userController.me)

router.post('/refresh', refreshController.refresh)

router.post('/logout', auth, loginController.logout)

router.post('/product', [auth, admin], productController.store)

router.put('/product/:id', [auth, admin], productController.update)

router.delete('/product/:id', [auth, admin], productController.delete)

router.get('/products', productController.getAll)

router.get('/product/:id', productController.getOne)

module.exports = router;