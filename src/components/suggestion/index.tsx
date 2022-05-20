import { FC } from 'react'
import { TextField as MuiTextField, TextFieldProps, styled } from '@mui/material'

import { ShouldRenderSuggestionFn } from '@/utils/types'

export const Suggestion: FC<SuggestionProps> = ({
  needle,
  shouldRenderSuggestion,
  value,
  textFieldProps,
  isFocused
}) => {
  if (shouldRenderSuggestion && value && !shouldRenderSuggestion(value)) {
    return null
  }
  return <TextField {...textFieldProps} value={value === '' && isFocused ? ' ' : value + needle} />
}

const TextField = styled(MuiTextField)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.4;
  z-index: -1;
`

export interface SuggestionProps {
  value?: string
  needle: string
  shouldRenderSuggestion?: ShouldRenderSuggestionFn
  textFieldProps?: TextFieldProps
  isFocused: boolean
}
