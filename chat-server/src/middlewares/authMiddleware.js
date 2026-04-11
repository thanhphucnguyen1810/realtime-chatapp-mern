import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'
import User from '~/models/user.model'

export const authMiddleware = {
  protect: async (req, res, next) => {
    try {
      let token

      // 1. Lấy token
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
      }

      if (!token) {
        return res.status(401).json({ message: 'Not logged in' })
      }

      // 2. Verify token
      const decoded = jwt.verify(token, env.JWT_SECRET)

      // 3. Check user
      const user = await User.findById(decoded.userId)
      if (!user) {
        return res.status(401).json({ message: 'User not found' })
      }

      // 4. Gắn user vào request
      req.user = user

      next()
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' })
    }
  }
}
