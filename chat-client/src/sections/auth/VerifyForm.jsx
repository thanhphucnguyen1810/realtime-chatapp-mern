import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Stack } from '@mui/material'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import FormProvider, { RHFTextField } from '~/components/hook-form'
import { useDispatch } from 'react-redux'
import { VerifyOTP } from '~/redux/slices/auth'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const VerifyForm = ({ email }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const VerifyCodeScheme = Yup.object().shape({
    code1: Yup.string().required(),
    code2: Yup.string().required(),
    code3: Yup.string().required(),
    code4: Yup.string().required(),
    code5: Yup.string().required(),
    code6: Yup.string().required()
  })

  const methods = useForm({
    resolver: yupResolver(VerifyCodeScheme),
    defaultValues: {
      code1: '', code2: '', code3: '',
      code4: '', code5: '', code6: ''
    }
  })

  const { handleSubmit, setValue, watch } = methods

  // 🔥 auto focus ô đầu
  useEffect(() => {
    document.querySelector('input[name="code1"]')?.focus()
  }, [])

  // 🔥 handle change (auto next)
  const handleChange = (e, nextField) => {
    const value = e.target.value.replace(/\D/g, '') // chỉ số
    if (!value) return

    setValue(e.target.name, value)

    if (nextField) {
      document.querySelector(`input[name="${nextField}"]`)?.focus()
    }
  }

  // 🔥 backspace
  const handleKeyDown = (e, prevField) => {
    if (e.key === 'Backspace' && !e.target.value) {
      document.querySelector(`input[name="${prevField}"]`)?.focus()
    }
  }

  // 🔥 paste OTP
  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '')
    if (pasteData.length === 6) {
      pasteData.split('').forEach((char, index) => {
        setValue(`code${index + 1}`, char)
      })
      document.querySelector('input[name="code6"]')?.focus()
    }
  }

  // 🔥 auto submit khi đủ 6 số
  const values = watch()
  useEffect(() => {
    const otp = Object.values(values).join('')
    if (otp.length === 6 && !otp.includes('')) {
      handleSubmit(onSubmit)()
    }
  }, [values])

  const onSubmit = async (data) => {
    try {
      if (!email) {
        toast.error('Email không tồn tại!')
        return
      }

      const otp =
        data.code1 +
        data.code2 +
        data.code3 +
        data.code4 +
        data.code5 +
        data.code6

      await dispatch(VerifyOTP({ email, otp }))
      toast.success('Xác nhận thành công')
      navigate('/app')
    } catch (error) {
      toast.error(error?.message || 'Verify thất bại')
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {/* OTP INPUT */}
        <Stack direction="row" spacing={1} onPaste={handlePaste}>
          <RHFTextField
            name="code1"
            inputProps={{ maxLength: 1, inputMode: 'numeric' }}
            onChange={(e) => handleChange(e, 'code2')}
          />
          <RHFTextField
            name="code2"
            inputProps={{ maxLength: 1, inputMode: 'numeric' }}
            onChange={(e) => handleChange(e, 'code3')}
            onKeyDown={(e) => handleKeyDown(e, 'code1')}
          />
          <RHFTextField
            name="code3"
            inputProps={{ maxLength: 1, inputMode: 'numeric' }}
            onChange={(e) => handleChange(e, 'code4')}
            onKeyDown={(e) => handleKeyDown(e, 'code2')}
          />
          <RHFTextField
            name="code4"
            inputProps={{ maxLength: 1, inputMode: 'numeric' }}
            onChange={(e) => handleChange(e, 'code5')}
            onKeyDown={(e) => handleKeyDown(e, 'code3')}
          />
          <RHFTextField
            name="code5"
            inputProps={{ maxLength: 1, inputMode: 'numeric' }}
            onChange={(e) => handleChange(e, 'code6')}
            onKeyDown={(e) => handleKeyDown(e, 'code4')}
          />
          <RHFTextField
            name="code6"
            inputProps={{ maxLength: 1, inputMode: 'numeric' }}
            onKeyDown={(e) => handleKeyDown(e, 'code5')}
          />
        </Stack>

        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          Verify
        </Button>
      </Stack>
    </FormProvider>
  )
}

export default VerifyForm
