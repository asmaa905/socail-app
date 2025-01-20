import { Box, CircularProgress } from '@mui/material'
import React from 'react'

export default function loading() {
  return (
    <Box sx={{display: "flex", height:"100vh", justifyContent:"center",alignItems:"center"}}>
      <CircularProgress />
    </Box>
  )
}
