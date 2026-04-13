import PropTypes from 'prop-types'

// form
import { useFormContext, Controller } from 'react-hook-form'
// @mui
import TextField from '@mui/material/TextField'

RHFTextField.propTypes = {
  name: PropTypes.string,
  helperText: PropTypes.node
}

export default function RHFTextField({ name, helperText, ...other }) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          variant='outlined'
          error={!!error}
          helperText={error ? error.message : helperText}
          {...other}
        />
      )}
    />
  )
}
