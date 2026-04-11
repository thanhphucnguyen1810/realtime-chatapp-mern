
import jwt from 'jsonwebtoken'
import otpGenerator from 'otp-generator'
import { BrevoProvider } from '~/providers/BrevoProvider'
import crypto from 'crypto'
import filterObj from '~/utils/FilterObj'

// Model
import User from '~/models/user.model'

import otp from '~/Templates/Mail/otp'
import resetPassword from '~/Templates/Mail/resetPassword'
import { promisify } from 'util'

// this function will return you jwt token
const signToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET)

const authController = {

  // Register New User
  register: async (req, res, next) => {
    try {
      const { firstName, lastName, email, password } = req.body
      const filteredBody = filterObj(req.body, 'firstName', 'lastName', 'email', 'password')

      // Check if a verified user with given email exists
      const existing_user = await User.findOne({ email: email })

      if (existing_user && existing_user.verified) {
        // user with this email already exists, please login
        return res.status(400).json({
          status: 'error',
          message: 'Email already in use, Please login.'
        })
      } else if (existing_user) {
        // if not verified than update prev one
        await User.findOneAndUpdate({ email: email }, filteredBody, {
          new: true,
          validateModifiedOnly: true
        })

        // generate an otp and send to email
        req.userId = existing_user._id
        next()
      } else {
        // if user is not created before than create a new one
        const new_user = await User.create(filteredBody)

        // generate an otp and send to email
        req.userId = new_user._id
        next()
      }
    } catch (error) {
      next(error)
    }
  },

  // Send OTP
  sendOTP: async (req, res, next) => {
    try {
      const { userId } = req

      const new_otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false
      })

      const otp_expiry_time = Date.now() + 10 * 60 * 1000

      const user = await User.findByIdAndUpdate(userId, {
        otp_expiry_time: otp_expiry_time
      })

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found when sending OTP.'
        })
      }

      user.otp = new_otp.toString()
      await user.save({ new: true, validateModifiedOnly: true })

      // TODO send mail
      // await sendEmail({
      //   from: 'thanhphucnguyen54@gmail.com',
      //   to: user.email,
      //   subject: 'Verification OTP',
      //   html: otp(user.firstName, new_otp),
      //   attachments: []
      // })
      await BrevoProvider.sendEmail(
        user.email,
        'Verification OTP',
        otp(user.firstName, new_otp)
      )

      res.status(200).json({
        status: 'success',
        message: 'OTP sent successfully!'
      })
    } catch (error) {
      next(error)
    }
  },


  // verifyOTP
  verifyOTP: async (req, res, next) => {
    // verify otp and update user accordingly
    const { email, otp } = req.body
    const user = await User.findOne({
      email,
      otp_expiry_time: { $gt: Date.now() }
    })


    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is invalid or OTP expired'
      })
    }

    if (user.verified) {
      return res.status(400).json({
        status: 'error',
        message: 'Email is already verified'
      })
    }

    if (!(await user.correctOTP(otp, user.otp))) {
      res.status(400).json({
        status: 'error',
        message: 'OTP is incorrect'
      })

      return
    }

    // OTP is correct

    user.verified = true
    user.otp = undefined
    await user.save({ new: true, validateModifiedOnly: true })

    const token = signToken(user._id)

    res.status(200).json({
      status: 'success',
      message: 'OTP verified Successfully!',
      token,
      user_id: user._id
    })
  },


  // Login User
  login: async (req, res, next) => {
    const { email, password } = req.body
    if ( !email || !password ) {
      return res.status(400).json({
        status: 'error',
        message: 'Both email and password are required.'
      })
    }

    const user = await User.findOne({ email: email }).select('+password')

    if (!user || !user.password) {
      return res.status(400).json({
        status: 'error',
        message: 'Incorrect password'
      })
    }

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(400).json({
        status: 'error',
        message: 'Email or password is incorrect.'
      })
    }

    const token = signToken(user._id)

    return res.status(200).json({
      status: 'success',
      message: 'Logged in successfully!',
      token,
      user_id: user._id
    })
  },

  // protect
  protect: async (req, res, next) => {
  //1) Getting token (JWT) and check if it's there
    let token
    // 'Bear kajkkaulieqjki8199100101'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]


    } else if (req.cookies.jwt) {
      token = req.cookies.jwt
    } else {
      req.status(400).json({
        status: 'error',
        message: 'You are not logged In! Please login to get access.'
      })
      return
    }

    // 2) Verification of token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    // 3) Check if user still exist
    const this_user = await User.findById(decoded.userId)

    if (!this_user) {
      res.status(400).json({
        status: 'error',
        message: 'The user dosen\'t exist.'
      })
    }

    // 4) check if user changed their password after token was issued
    if (this_user.changedPasswordAfter(decoded.iat)) {
      res.status(400).json({
        status: 'error',
        message: 'User recently updated password! Please log in again.'
      })
    }

    //
    req.user = this_user
    next()
  },

  // Types of routes => Protected (Only logged in users an access these) & Unprotected

  // forgotPassword
  forgotPassword: async (req, res, next) => {
  // 1) Get users based on POSTed email
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'There is no user with given email address.'
      })
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken()
    // console.log('RESET TOKEN:', resetToken)

    await user.save({ validateBeforeSave: false })

    // 3) Send it to user's email
    try {
      // const resetURL = `https://zenya.com/auth/reset-password?code=${resetToken}`
      const resetURL = `http://localhost:5173/auth/new-password?token=${resetToken}`
      // console.log(resetURL)

      // await sendEmail({
      //   from: 'thanhphucnguyen54@gmail.com',
      //   to: user.email,
      //   subject: 'Reset Password',
      //   html: resetPassword(user.firstName, resetURL),
      //   attachments: []
      // })
      await BrevoProvider.sendEmail(
        user.email,
        'Reset Password',
        resetPassword(user.firstName, resetURL)
      )

      res.status(200).json({
        status: 'success',
        message: 'Reset Password link sent to Email!'
      })
    } catch (error) {
      user.passwordResetToken = undefined
      user.passwordResetExpires = undefined

      await user.save({ validateBeforeSave: false })

      // console.error('Email error:', error.response?.body || error.message || error)

      return res.status(500).json({
        message: 'There was an error sending the email, Please try again later.'
      })
    }
  },

  // resetPassword
  resetPassword: async (req, res, next) => {
  //1) Get user based on  token
    const hashedToken = crypto.createHash('sha256').update(req.body.token).digest('hex')

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    })

    // 2) If token has expired or submission is out of time window
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Token is Invalid or Expired.'
      })
    }

    // 3) Update users password and set resetToken & expiry to undifine
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined

    await user.save()

    // 4) Log in the user and Send new JWT
    //TODO => Send an email to user informing about password

    const token = signToken(user._id)
    res.status(200).json({
      status: 'success',
      message: 'Password reseted successfully!',
      token
    })
  }
}

export default authController

