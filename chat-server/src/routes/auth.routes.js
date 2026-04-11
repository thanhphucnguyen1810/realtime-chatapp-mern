import { Router } from 'express'
import { authController } from '~/controllers/auth.controller'
import { authValidation } from '~/validations/auth.validation'

const router = Router()

router.post('/register', authValidation.register, authController.register)

router.post('/send-otp', authController.sendOTP)

router.post('/verify', authController.verifyOTP)

router.post('/login', authValidation.login, authController.login)

router.post('/forgot-password', authValidation.forgotPassword, authController.forgotPassword)

router.post('/reset-password', authValidation.resetPassword, authController.resetPassword)

export default router
