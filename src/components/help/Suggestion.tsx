import React, { FC } from 'react'
import TextField from '@material-ui/core/TextField'

import { ShouldRenderSuggestionFn } from '../../utils/types'

export interface SuggestionProps {
  value?: string
  needle: string
  shouldRenderSuggestion?: ShouldRenderSuggestionFn
}

const Suggestion: FC<SuggestionProps> = ({
  needle,
  shouldRenderSuggestion,
  value
}) => {
  if (shouldRenderSuggestion && value && !shouldRenderSuggestion(value)) {
    return null
  }

  return (
    <TextField
      variant='outlined'
      style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        opacity: '0.4',
        zIndex: -1
      }}
      value={value + needle}
    />
  )
}

export default Suggestion
