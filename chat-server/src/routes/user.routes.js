import { Router } from 'express'
import userController from '~/controllers/user.controller'
import { authMiddleware } from '~/middlewares/authMiddleware'

const router = Router()

router.patch('/update-me', authMiddleware.protect, userController.updateMe)

router.get('/get-users', authMiddleware.protect, userController.getUsers)
router.get('/get-friends', authMiddleware.protect, userController.getFriends)
router.get('/get-friend-requests', authMiddleware.protect, userController.getRequests)


export default router
