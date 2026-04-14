import { Box, Stack, Typography, Avatar, Badge } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { faker } from '@faker-js/faker'
import StyledBadge from './StyledBadge'
import { useDispatch } from 'react-redux'
import { SelectConversation } from '~/redux/slices/app'

const ChatElement = ( { id, name, img, msg, time, unread, online }) => {
  const theme = useTheme()
  const dispatch = useDispatch()

  return (
    <Box
      onClick={() => {
        dispatch(SelectConversation({ room_id: id }))
      }}
      sx={{
        width: '100%',
        borderRadius: 1,
        backgroundColor: theme.palette.mode === 'light' ? '#fff' : theme.palette.background.default
      }}
      p={2}
    >
      <Stack
        direction='row'
        alignItems='center'
        justifyContent='space-between'
      >
        <Stack direction='row' spacing={2}>
          { online
            ? (
              <StyledBadge
                overlap='circular'
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant='dot'
              >
                <Avatar src={faker.image.avatar()} sx={{ width: 40, height: 40 }} />
              </StyledBadge>
            )
            : (
              <Avatar src={faker.image.avatar()} sx={{ width: 40, height: 40 }} />
            )
          }

          <Stack spacing={0.4}>
            <Typography variant='subtitle2'> {name} </Typography>
            <Typography variant='caption'> {msg} </Typography>
          </Stack>
        </Stack>

        <Stack spacing={1.5} alignItems='center'>
          <Typography sx={{ fontWeight: 600 }} variant='caption'> {time} </Typography>
          <Badge
            color='primary'
            badgeContent={unread}
            sx={{
              '& .MuiBadge-badge': {
                minWidth: 20,
                height: 20,
                borderRadius: '50%',
                fontSize: '0.75rem'
              }
            }}
          > </Badge>
        </Stack>
      </Stack>
    </Box>
  )
}

export default ChatElement
