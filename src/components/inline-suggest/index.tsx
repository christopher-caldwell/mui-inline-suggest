import { styled, TextField } from '@mui/material'

import { Suggestion } from '../suggestion'
import { useInlineSuggest, Props } from './useInlineSuggest'

export const InlineSuggest = function <TSuggestion>(props: Props<TSuggestion>) {
  const { shouldRenderSuggestion, textFieldProps } = props
  const { value, isFocused, getNeedle, ...restHandlers } = useInlineSuggest(props)
  return (
    <Wrapper>
      <TextField {...textFieldProps} value={value} {...restHandlers} />
      <Suggestion
        isFocused={isFocused}
        value={value}
        needle={getNeedle()}
        shouldRenderSuggestion={shouldRenderSuggestion}
        textFieldProps={textFieldProps}
      />
    </Wrapper>
  )
}

const Wrapper = styled('span')`
  position: relative;
`
