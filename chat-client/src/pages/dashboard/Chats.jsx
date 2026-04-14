import {
  Box,
  IconButton,
  Stack,
  Typography,
  Divider,
  Button
} from '@mui/material'
import {
  ArchiveBox,
  CircleDashed,
  MagnifyingGlass,
  Users
} from 'phosphor-react'
import { useTheme } from '@mui/material/styles'
import { ChatList } from '~/data'
import SimpleBarStyle from '~/components/Scrollbar'
import {
  Search,
  SearchIconWrapper,
  StyledInputBase
} from '~/components/Search'
import ChatElement from '~/components/ChatElement'
import { useState } from 'react'
import Friends from '~/sections/main/Friends'

const Chats = () => {
  const theme = useTheme()
  const [openDialog, setOpenDialog] = useState(false)

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          width: 320,
          backgroundColor:
          theme.palette.mode === 'light'
            ? '#F8FAFF'
            : theme.palette.background.paper,
          boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.25)'
        }}
      >
        <Stack p={3} spacing={2} sx={{ height: '100vh' }}>
          {/* Title */}
          <Stack
            direction='row'
            alignItems='center'
            justifyContent='space-between'
            sx={{ px: 2, py: 1 }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                background: 'linear-gradient(to right, #4facfe, #00f2fe)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
          Chats
            </Typography>

            <Stack direction='row' alignItems='center' spacing={1}>
              <IconButton
                size='large'
                onClick={() => {handleOpenDialog()}}
              >
                <Users />
              </IconButton>
              <IconButton size='large'>
                <CircleDashed />
              </IconButton>
            </Stack>


          </Stack>

          {/* Search */}
          <Stack sx={{ width: '100%' }}>
            <Search
              sx={{
                position: 'relative',
                borderRadius: 2,
                backgroundColor: theme.palette.mode === 'light'
                  ? theme.palette.grey[100]
                  : theme.palette.grey[800],
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'light'
                    ? theme.palette.grey[200]
                    : theme.palette.grey[700]
                },
                border: `1px solid ${
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[300]
                    : theme.palette.grey[600]
                }`,
                boxShadow:
                theme.palette.mode === 'light'
                  ? '0 1px 2px rgba(0,0,0,0.08)'
                  : '0 1px 2px rgba(255,255,255,0.05)',
                transition: 'all 0.3s ease'
              }}
            >
              <SearchIconWrapper
                sx={{
                  padding: 1.5,
                  height: '100%',
                  position: 'absolute',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <MagnifyingGlass color='#709CE6' />
              </SearchIconWrapper>

              <StyledInputBase
                placeholder='Search...'
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Stack>

          {/* Archive Section */}
          <Stack spacing={1}>
            <Stack
              direction='row'
              alignItems='center'
              spacing={1.5}
              sx={{
                p: 1.2,
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                '&:hover': {
                  backgroundColor:
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[800]
                }
              }}
            >
              <ArchiveBox size={24} color='#637381' />
              <Button
                sx={{
                  fontWeight: 'bold',
                  color: 'text.primary'
                }}
              >
              Archive
              </Button>
            </Stack>

            <Divider
              sx={{
                borderColor:
                theme.palette.mode === 'light'
                  ? theme.palette.grey[300]
                  : theme.palette.grey[700]
              }}
            />
          </Stack>

          {/* Chat List */}
          <Stack spacing={2} direction="column" sx={{ flexGrow: 1, minHeight: 0 }}>
            <SimpleBarStyle
              timeout={500}
              clickOnTrack={false}
              style={{ maxHeight: '100%' }}
            >
              <Stack spacing={2.4} px={1}>
                <Typography variant="subtitle2" sx={{ color: '#676767' }}>
                Pinned
                </Typography>
                {ChatList.filter((el) => el.pinned).map((el) => (
                  <ChatElement key={el.id} {...el} />
                ))}
              </Stack>

              <Stack spacing={2.4} px={1}>
                <Typography variant="subtitle2" sx={{ color: '#676767' }}>
                All Chats
                </Typography>
                {ChatList.filter((el) => !el.pinned).map((el) => (
                  <ChatElement key={el.id} {...el} />
                ))}
              </Stack>
            </SimpleBarStyle>
          </Stack>
        </Stack>
      </Box>

      {openDialog && (
        <Friends open={openDialog} handleClose={handleCloseDialog}/>
      )}
    </>
  )
}

export default Chats
