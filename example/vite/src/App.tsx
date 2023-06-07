import { useState } from 'react'
import { Typography, Grid } from '@mui/material'
import { InlineSuggest } from '@caldwell619/mui-inline-suggest'

import { Suggestions } from './features'

const App = () => {
  const [suggestions, setSuggestions] = useState<string[]>(['Angular', 'jQuery', 'Polymer', 'React', 'Vue.js'])

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant='h4'>@caldwell619/mui-inline-suggest</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='subtitle1'>
          Material UI TextField component that will suggest the rest of the input, like an IDE or terminal
        </Typography>
      </Grid>
      <Grid item container xs={12} sx={{ marginTop: '10vh', margin: '0 auto' }} spacing={3}>
        <Grid item xs={12} container>
          <Grid item xs={6}>
            <Suggestions suggestions={suggestions} setSuggestions={setSuggestions} />
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ marginTop: '10vh' }} container>
          <Grid item xs={6}>
            <Typography variant='h5' sx={{ marginBottom: '3vh' }}>
              Result
            </Typography>
            <InlineSuggest
              textFieldProps={{ fullWidth: true, placeholder: 'Type to see suggestions', variant: 'outlined' }}
              suggestions={suggestions}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default App
