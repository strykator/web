'use client'

import {LinearProgress, Box} from '@mui/material'

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <Box sx={{width: '100%', zIndex: 3}}>
      <LinearProgress />
    </Box>
  )
}
