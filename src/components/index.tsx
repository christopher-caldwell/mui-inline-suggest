import React, { useState, useCallback, KeyboardEvent, ChangeEvent } from 'react'
import { TextFieldProps } from '@material-ui/core'

import Input from './help/Input'
import Suggestion from './help/Suggestion'

import { ShouldRenderSuggestionFn, GetSuggestionValueFn } from '../utils/types'
import {
  filterSuggestions,
  getNeedleFromString,
  getNextSafeIndexFromArray,
  getPreviousSafeIndexFromArray,
  KeyEnum
} from '../utils'

export const InlineSuggest = function <T>({
  getSuggestionValue,
  suggestions,
  ignoreCase,
  onInputChange,
  onInputBlur,
  navigate,
  shouldRenderSuggestion,
  onMatch,
  textFieldProps
}: Props<T>) {
  const [activeIndex, setActiveIndex] = useState(-1)
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleOnBlur: TextFieldProps['onBlur'] = useCallback(
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

  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
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

  const handleOnKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
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

  const handleOnKeyUp = useCallback(
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

  return (
    <span style={{ position: 'relative' }}>
      <Input
        {...textFieldProps}
        value={value}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        onKeyUp={handleOnKeyUp}
        onKeyDown={handleOnKeyDown}
        onFocus={handleFocus}
      />
      <Suggestion
        isFocused={isFocused}
        value={value}
        needle={getNeedle()}
        shouldRenderSuggestion={shouldRenderSuggestion}
        textFieldProps={textFieldProps}
      />
    </span>
  )
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
