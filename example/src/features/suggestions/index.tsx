import { FC, Dispatch, SetStateAction } from 'react'
import { TextField, Stack, Chip, IconButton, Button, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useTextField } from 'use-mui'

export const Suggestions: FC<Props> = ({ suggestions, setSuggestions }) => {
  const { value: newSuggestion, setValue: setNewSuggestion, handleChange: onChange } = useTextField()
  const handleDelete = (chipToDelete: string) => () => {
    console.log({ chipToDelete })
    setSuggestions(chips => chips.filter(chip => chip !== chipToDelete))
  }
  const handleAddSuggestion = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setSuggestions(currentSuggestions => {
      const doesNewSuggestionExistInList = currentSuggestions.find(
        currentSuggestion => currentSuggestion === newSuggestion
      )
      if (doesNewSuggestionExistInList) return currentSuggestions

      return [...currentSuggestions, newSuggestion]
    })
    setNewSuggestion('')
  }

  return (
    <form onSubmit={handleAddSuggestion}>
      <Typography variant='h5' sx={{ marginBottom: '3vh' }}>
        Suggestion Config
      </Typography>
      <TextField
        value={newSuggestion}
        onChange={onChange}
        fullWidth
        sx={{ marginBottom: '1vh' }}
        label='New Suggestion'
        InputProps={{
          endAdornment: newSuggestion ? (
            <IconButton onClick={() => setNewSuggestion('')}>
              <CloseIcon />
            </IconButton>
          ) : null
        }}
      />
      <Button sx={{ marginBottom: '3vh' }} variant='contained' type='submit' onClick={handleAddSuggestion}>
        Add
      </Button>

      <Stack direction='row' spacing={1}>
        {suggestions.map(suggestion => {
          return <Chip key={suggestion} label={suggestion} onDelete={handleDelete(suggestion)} />
        })}
      </Stack>
    </form>
  )
}

interface Props {
  suggestions: string[]
  setSuggestions: Dispatch<SetStateAction<string[]>>
}
