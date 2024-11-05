const express = require('express')

const router = new express.Router()

const userController = require('../Controller/userController')
const jwtMiddleware = require('../Middleware/jwtMiddleWare')

//defining paths
router.get('/userdetails/:id',userController.getUserDetails)
router.post('/user-register',userController.registerController)
router.post('/user-login',userController.loginController)
router.put('/update/:id',jwtMiddleware,userController.editUserController)
router.delete("/delete/:id",jwtMiddleware,userController.deleteUserController)
module.exports = router