import React, { useState, Fragment } from 'react'
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Stack,
  Typography
} from '@mui/material'
import {
  CaretLeft,
  Bell,
  Lock,
  Key,
  PencilCircle,
  Image,
  Note,
  Keyboard,
  Info
} from 'phosphor-react'

import { faker } from '@faker-js/faker'
import { useTheme } from '@mui/material/styles'
import Shortcuts from '~/sections/settings/Shortcuts'
import ThemeDialog from '~/sections/settings/ThemeDialog'

const Settings = () => {
  const theme = useTheme()

  const [openTheme, setOpenTheme] = useState(false)

  const handleOpenTheme = () => {
    setOpenTheme(true)
  }

  const handleCloseTheme = () => {
    setOpenTheme(false)
  }

  const [openShortcuts, setOpenShortcuts] = useState(false)

  const handleOpenShortcuts = () => {
    setOpenShortcuts(true)
  }
  const handleCloseShortcuts = () => {
    setOpenShortcuts(false)
  }

  const list = [
    {
      key: 0,
      icon: <Bell size={20} />,
      title: 'Notifications',
      onclick: () => {}
    },
    {
      key: 1,
      icon: <Lock size={20} />,
      title: 'Privacy',
      onclick: () => {}
    },
    {
      key: 2,
      icon: <Key size={20} />,
      title: 'Security',
      onclick: () => {}
    },
    {
      key: 3,
      icon: <PencilCircle size={20} />,
      title: 'Theme',
      onclick: handleOpenTheme
      // onclick: () => {}
    },
    {
      key: 4,
      icon: <Image size={20} />,
      title: 'Chat Wallpaper',
      onclick: () => {}
    },
    {
      key: 5,
      icon: <Note size={20} />,
      title: 'Request Account Info',
      onclick: () => {}
    },
    {
      key: 6,
      icon: <Keyboard size={20} />,
      title: 'Keyboard Shortcuts',
      onclick: handleOpenShortcuts
    // onclick: () => {}
    },
    {
      key: 7,
      icon: <Info size={20} />,
      title: 'Help',
      onclick: () => {}
    }
  ]

  return (
    <>
      <Stack direction='row' sx={{ width: '100%' }}>
        {/* LeftPanel */}
        <Box
          sx={{
            overflow: 'scroll',
            height: '100vh',
            width: 320,
            backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' : theme.palette.background,
            boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.25)'

          }}
        >
          <Stack p={4} spacing={5}>
            {/* Header */}
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='space-between'
              sx={{ px: 2 }}
            >
              <IconButton>
                <CaretLeft size={24} color='#4B4B4B' />
              </IconButton>
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
                Settings
              </Typography>
            </Stack>


            {/* Profile */}
            <Stack direction='row' spacing={3}>
              <Avatar src={faker.image.avatarGitHub()} alt={faker.person.fullName()} sx={{ width: 56, height: 56 }} />
              <Stack spacing={0.5}>
                <Typography variant='article'>
                  {faker.person.fullName()}
                </Typography>
                <Typography variant='body2'>
                  {faker.lorem.words()}
                </Typography>
              </Stack>
            </Stack>
            {/* List of options */}
            <Stack spacing={4}>
              {list.map(({ key, icon, title, onclick }) => (
                <Fragment key={key}>
                  <Stack
                    spacing={2}
                    onClick={onclick}
                    sx={{
                      cursor: 'pointer'
                    }}
                  >
                    <Stack direction='row' spacing={2} alignItems='center'>
                      {icon}
                      <Typography variant='body2'>{title}</Typography>
                    </Stack>
                    {key != 7 && <Divider />}
                  </Stack>
                </Fragment>
              ))}
            </Stack>
          </Stack>

        </Box>
        {/* RightPanel */}
      </Stack>
      {openTheme && <ThemeDialog open={openTheme} handleClose={handleCloseTheme} />}
      {openShortcuts && <Shortcuts open={openShortcuts} handleClose={handleCloseShortcuts} />}

    </>
  )
}

export default Settings
