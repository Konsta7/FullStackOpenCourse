import './Notification.css'
import { Alert } from '@mui/material'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <Alert severity={type} style={{ marginTop: 10, marginBottom: 10 }}>
      {message}
    </Alert>
  )
}

export default Notification