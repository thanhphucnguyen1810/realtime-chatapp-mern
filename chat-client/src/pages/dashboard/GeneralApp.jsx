import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import { Stack, Box, Typography } from '@mui/material'
import Chats from '~/pages/dashboard/Chats'
import Conversation from '~/components/Conversation'
import Contact from '~/components/Contact'
import SharedMessages from '~/components/SharedMessages'
import StarredMessages from '~/components/StarredMessages'
import NoChatSVG from '~/assets/Illustration/NoChat'

const renderSidebarContent = (type) => {
  switch (type) {
  case 'CONTACT':
    return <Contact />
  case 'STARRED':
    return <StarredMessages />
  case 'SHARED':
    return <SharedMessages />
  default:
    return null
  }
}

const GeneralApp = () => {
  const { sidebar, room_id, chat_type } = useSelector((store) => store.app)
  const theme = useTheme()
  const mainContentWidth = sidebar.open ? 'calc(100vw - 740px)' : 'calc(100vw - 420px)'
  const backgroundColor = theme.palette.mode === 'light' ? '#F0F4FA' : theme.palette.background.paper

  return (
    <Stack direction='row' sx={{ width: '100%', height: '100vh' }}>
      {/* Chats */}
      <Chats />

      <Box sx={{ height: '100%', width: mainContentWidth, backgroundColor }} >
        {/* Conversation */}
        { room_id !== null && chat_type === 'individual'
          ? <Conversation />
          : (
            <Stack spacing={2} sx={{ height: '100%', width: '100%' }} alignItems='center' justifyContent={'center'}>
              <NoChatSVG />
              <Typography variant='subtitle2'>
                Select a conversation or start new one
              </Typography>
            </Stack>
          )}

      </Box>

      {/* Contact */}
      {sidebar.open && renderSidebarContent(sidebar.type)}

    </Stack>
  )
}

export default GeneralApp
