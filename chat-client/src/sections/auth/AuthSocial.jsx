import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'

import { GithubLogo, GoogleLogo, TwitterLogo, FacebookLogo } from 'phosphor-react'

// ----------------------------------------------------------------------
const AuthSocial = () => {
  const handleGoogleLogin = async () => {

  }

  const handleGithubLogin = async () => {

  }

  const handleTwitterLogin = async () => {

  }

  const handleFacebookLogin = async () => {

  }
  return (
    <div>
      <Divider
        sx={{
          my: 2.5,
          typography: 'overline',
          fontWeight: 800,
          color: 'text.disabled',
          '&::before, &::after':{
            borderTopStyle: 'dashed'
          }
        }}
      >
          OR
      </Divider>

      <Stack direction="row" justifyContent="center" alignItems='center' spacing={2}>
        <IconButton
          sx={{
            bgcolor: '#FEECEB',
            '&:hover': { bgcolor: '#f8d8d5' },
            padding: 1.5,
            borderRadius: 2,
            boxShadow: '0px 2px 8px rgba(0,0,0,0.1)'
          }}
          onClick={handleGoogleLogin}
        >
          <GoogleLogo color="#DF3E30" />
        </IconButton>

        <IconButton
          color="inherit"
          sx={{
            bgcolor: '#EDEDED',
            '&:hover': { bgcolor: '#d6d6d6' },
            padding: 1.5,
            borderRadius: 2,
            boxShadow: '0px 2px 8px rgba(0,0,0,0.1)'
          }}
          onClick={handleGithubLogin}
        >
          <GithubLogo />
        </IconButton>

        <IconButton
          sx={{
            bgcolor: '#E8F4FD',
            '&:hover': { bgcolor: '#d0e9fd' },
            padding: 1.5,
            borderRadius: 2,
            boxShadow: '0px 2px 8px rgba(0,0,0,0.1)'
          }}
          onClick={handleTwitterLogin}
        >
          <TwitterLogo color="#1C9CEA" />
        </IconButton>
        <IconButton
          sx={{
            bgcolor: '#E7F3FF',
            '&:hover': { bgcolor: '#d4e6fb' },
            padding: 1.5,
            borderRadius: 2,
            boxShadow: '0px 2px 8px rgba(0,0,0,0.1)'
          }}
          onClick={handleFacebookLogin}
        >
          <FacebookLogo color="#1877F2" />
        </IconButton>

      </Stack>

    </div>
  )
}

export default AuthSocial
