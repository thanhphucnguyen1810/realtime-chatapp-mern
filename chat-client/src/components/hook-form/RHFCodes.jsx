import { Stack, TextField } from '@mui/material'
import { useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

const RHFCodes = ({ keyName = '', inputs = [], ...other }) => {
  const codesRef = useRef(null)

  const control = useFormContext()

  return (
    <Stack direction='row' spacing={2} justifyContent='center' ref={codesRef}>
      {inputs.map((name, index) => (
        <Controller
          key={name}
          name={`${keyName}${index+1}`}
          control={control}
          render={({field, fieldState: {error}}) => (
            <TextField {...field} />
          )}
        >

        </Controller>
      ))}
    </Stack>
  )
}

export default RHFCodes

