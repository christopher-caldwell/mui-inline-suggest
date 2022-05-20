import { useState, useCallback, KeyboardEvent } from 'react'
import { TextFieldProps } from '@mui/material'

import {
  filterSuggestions,
  getNeedleFromString,
  getNextSafeIndexFromArray,
  getPreviousSafeIndexFromArray,
  KeyEnum,
  ShouldRenderSuggestionFn,
  GetSuggestionValueFn
} from '@/utils'

export const useInlineSuggest = function <T>({
  getSuggestionValue,
  suggestions,
  ignoreCase,
  onInputChange,
  onInputBlur,
  navigate,
  onMatch
}: Props<T>) {
  const [activeIndex, setActiveIndex] = useState(-1)
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const onFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const onBlur: TextFieldProps['onBlur'] = useCallback(
    ({ target: { value } }) => {
      onInputBlur && onInputBlur(value)
      setIsFocused(false)
    },
    [onInputBlur]
  )

  const fireOnChange = useCallback(
    (newValue: string) => {
      onInputChange && onInputChange(newValue)
    },
    [onInputChange]
  )

  const onChange: TextFieldProps['onChange'] = useCallback(
    e => {
      const valueFromEvent = e.currentTarget.value

      const newMatchedArray = filterSuggestions(valueFromEvent, suggestions, Boolean(ignoreCase), getSuggestionValue)

      setActiveIndex(newMatchedArray.length > 0 ? 0 : -1)
      setValue(valueFromEvent)
      fireOnChange(valueFromEvent)
    },
    [fireOnChange, getSuggestionValue, ignoreCase, suggestions]
  )

  const getMatchedSuggestions = useCallback(() => {
    return filterSuggestions(value, suggestions, Boolean(ignoreCase), getSuggestionValue) as T[]
  }, [value, suggestions, ignoreCase, getSuggestionValue])

  const onKeyDown: TextFieldProps['onKeyDown'] = useCallback(
    event => {
      const { key } = event
      if (activeIndex === -1) return

      if (allowedKeyCodes.includes(key as KeyEnum)) event.preventDefault()

      if (navigate && (key === KeyEnum.DOWN_ARROW || key === KeyEnum.UP_ARROW)) {
        const matchedSuggestions = getMatchedSuggestions()
        setActiveIndex(
          key === KeyEnum.DOWN_ARROW
            ? getNextSafeIndexFromArray(matchedSuggestions, activeIndex)
            : getPreviousSafeIndexFromArray(matchedSuggestions, activeIndex)
        )
      }
    },
    [navigate, getMatchedSuggestions, activeIndex]
  )

  const onKeyUp: TextFieldProps['onKeyUp'] = useCallback(
    ({ key }: KeyboardEvent<HTMLDivElement>) => {
      if (activeIndex >= 0 && (key === KeyEnum.TAB || key === KeyEnum.ENTER || key === KeyEnum.RIGHT_ARROW)) {
        const matchedSuggestions = getMatchedSuggestions()
        const matchedValue = matchedSuggestions[activeIndex]

        const newValue = getSuggestionValue ? getSuggestionValue(matchedValue) : String(matchedValue)

        setValue(newValue)

        fireOnChange(newValue)

        onMatch && onMatch(matchedValue)
      }
    },
    [activeIndex, fireOnChange, getMatchedSuggestions, getSuggestionValue, onMatch]
  )

  const getNeedle = () => {
    const matchedSuggestions = getMatchedSuggestions()

    if (!matchedSuggestions[activeIndex]) return ''

    return getNeedleFromString(
      getSuggestionValue
        ? getSuggestionValue(matchedSuggestions[activeIndex])
        : String(matchedSuggestions[activeIndex]),
      value
    )
  }

  return {
    value,
    onChange,
    onBlur,
    onKeyUp,
    onKeyDown,
    onFocus,
    isFocused,
    getNeedle
  }
}

const allowedKeyCodes = [KeyEnum.TAB, KeyEnum.UP_ARROW, KeyEnum.DOWN_ARROW]

export interface Props<T = string> {
  className?: string
  getSuggestionValue?: GetSuggestionValueFn<T>
  ignoreCase?: boolean
  inputValue?: string
  navigate?: boolean
  shouldRenderSuggestion?: ShouldRenderSuggestionFn
  suggestions: T[]
  onInputBlur?(value: string): void
  onInputChange?(newValue: string): void
  onMatch?(matchedValue: T): void
  textFieldProps?: TextFieldProps
}
