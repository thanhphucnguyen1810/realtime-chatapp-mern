import { StatusCodes } from 'http-status-codes'
import { authService } from '~/services/auth.service'

const register = async(req, res, next) => {
  try {
    const result = await authService.register(req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) { next(error) }
}

const sendOTP = async (req, res, next) => {
  try {
    const result = await authService.sendOTP(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const verifyOTP = async (req, res, next) => {
  try {
    const result = await authService.verifyOTP(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const forgotPassword = async (req, res, next) => {
  try {
    const result = await authService.forgotPassword(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const resetPassword = async (req, res, next) => {
  try {
    const result = await authService.resetPassword(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

export const authController = {
  register,
  sendOTP,
  verifyOTP,
  login,
  forgotPassword,
  resetPassword
}
