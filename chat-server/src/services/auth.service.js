import jwt from 'jsonwebtoken'
import otpGenerator from 'otp-generator'
import crypto from 'crypto'
import User from '~/models/user.model'
import { BrevoProvider } from '~/providers/BrevoProvider'
import otpTemplate from '~/Templates/Mail/otp'
import resetPasswordTemplate from '~/Templates/Mail/resetPassword'
import { env } from '~/config/environment'

const signToken = (userId) => jwt.sign({ userId }, env.JWT_SECRET)

const register = async (reqBody) => {
  const { firstName, lastName, email, password } = reqBody
  let user = await User.findOne({ email })
  if (user && user.verified) {
    throw new Error('Email already in use')
  }
  if (user) {
    user.firstName = firstName
    user.lastName = lastName
    user.password = password
    await user.save()
  } else {
    user = await User.create({ firstName, lastName, email, password })
  }
  return { userId: user._id }
}

const sendOTP = async ({ userId }) => {
  const newOTP = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false
  })

  const user = await User.findById(userId)
  if (!user) throw new Error('User not found')

  user.otp = newOTP
  user.otp_expiry_time = Date.now() + 10 * 60 * 1000
  await user.save()

  await BrevoProvider.sendEmail(
    user.email,
    'Verification OTP',
    otpTemplate(user.firstName, newOTP)
  )

  return { message: 'OTP sent' }
}

const verifyOTP = async ({ email, otp }) => {
  const user = await User.findOne({
    email,
    otp_expiry_time: { $gt: Date.now() }
  })

  if (!user) throw new Error('OTP expired')

  if (!(await user.correctOTP(otp, user.otp))) {
    throw new Error('OTP incorrect')
  }

  user.verified = true
  user.otp = undefined
  await user.save()

  const token = signToken(user._id)

  return { token, user_id: user._id }
}

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new Error('Invalid credentials')
  }

  if (!user.verified) {
    throw new Error('Please verify your email before login')
  }

  const token = signToken(user._id)

  return { token, user_id: user._id }
}

const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email })
  if (!user) throw new Error('Email not found')

  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })

  const resetURL = `http://localhost:5173/auth/new-password?token=${resetToken}`

  await BrevoProvider.sendEmail(
    user.email,
    'Reset Password',
    resetPasswordTemplate(user.firstName, resetURL)
  )

  return { message: 'Reset link sent!' }
}


const resetPassword = async ({ token, password, passwordConfirm }) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  })

  if (!user) throw new Error('Token invalid or expired')

  user.password = password
  user.passwordConfirm = passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined

  await user.save()

  const newToken = signToken(user._id)

  return { token: newToken }
}

export const authService = {
  register,
  sendOTP,
  verifyOTP,
  login,
  forgotPassword,
  resetPassword
}
