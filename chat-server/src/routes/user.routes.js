import { Router } from 'express'
import userController from '~/controllers/user.controller'
import { authMiddleware } from '~/middlewares/authMiddleware'

const router = Router()

router.patch('/update-me', authMiddleware.protect, userController.updateMe)

export default router
