import React, { FC } from 'react'
import TextField, { TextFieldProps } from '@material-ui/core/TextField'

import { ShouldRenderSuggestionFn } from '../../utils/types'

const Suggestion: FC<SuggestionProps> = ({ needle, shouldRenderSuggestion, value, textFieldProps, isFocused }) => {
  if (shouldRenderSuggestion && value && !shouldRenderSuggestion(value)) {
    return null
  }
  return (
    <TextField
      {...textFieldProps}
      style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        opacity: '0.4',
        zIndex: -1
      }}
      value={value === '' && isFocused ? ' ' : value + needle}
    />
  )
}

export interface SuggestionProps {
  value?: string
  needle: string
  shouldRenderSuggestion?: ShouldRenderSuggestionFn
  textFieldProps?: TextFieldProps
  isFocused: boolean
}

export default Suggestion
