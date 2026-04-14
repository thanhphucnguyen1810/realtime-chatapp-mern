import { Dialog, DialogContent, Stack, Tab, Tabs } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FriendComponent, FriendRequestComponent, UserComponent } from '~/components/Friends'
import { FetchFriendRequests, FetchFriends, FetchUsers } from '~/redux/slices/app'

const UsersList = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(FetchUsers())
  }, [])

  const { users } = useSelector((state) => state.app)

  return (
    <>
      {users?.map((el) => {
        // render usercomponent
        return <UserComponent key={el._id} {...el}/>
      })}
    </>
  )
}

const FriendList = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(FetchFriends())
  }, [])
  const { friends } = useSelector((state) => state.app)
  return (
    <>
      {friends?.map((el) => {
        return <FriendComponent key={el._id} {...el} />
      })}
    </>
  )
}

const FriendRequestList = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(FetchFriendRequests())
  }, [])

  const { friendRequests } = useSelector((state) => state.app)

  return (
    <>
      {friendRequests?.map((el) => {
        // render friend component: el ={_id, sender: { _id, firstName, lastName, img, online}}
        return <FriendRequestComponent key={el._id} {...el.sender} id={el._id}/>
      })}
    </>
  )
}

const Friends = ({ open, handleClose }) => {
  const [value, setValue] = useState(0)
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  return (
    <Dialog
      fullWidth
      maxWidth='xs'
      open={open}
      keepMounted
      onClose={handleClose}
      sx={{ p:4 }}
    >
      <Stack p={2} sx={{ width: '100%' }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label='Explore' />
          <Tab label='Friends' />
          <Tab label='Requests' />
        </Tabs>
      </Stack>
      {/* Dialog Content */}
      <DialogContent>
        <Stack sx={{ height: '100%' }}>
          <Stack spacing={2.5}>
            {(() => {
              switch (value) {
              case 0: // display all user
                return <UsersList />
              case 1: // display all friends
                return <FriendList />
              case 2: // display all friend requests
                return <FriendRequestList />

              default:
                break
              }
            })()}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default Friends
