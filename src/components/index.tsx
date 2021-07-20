import React, { useState } from 'react'
import { TextFieldProps } from '@material-ui/core'
import memoize from 'lodash.memoize'

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

const memoizedFilterSuggestions = memoize(filterSuggestions)
export const InlineSuggest = function <T>({
  getSuggestionValue,
  suggestions,
  ignoreCase,
  onInputChange,
  onInputBlur,
  navigate,
  shouldRenderSuggestion,
  onMatch
}: Props<T>) {
  const [activeIndex, setActiveIndex] = useState(-1)
  const [value, setValue] = useState('')

  const handleOnBlur: TextFieldProps['onBlur'] = ({ target: { value } }) => {
    onInputBlur && onInputBlur(value)
  }
  const fireOnChange = (newValue: string) => {
    onInputChange && onInputChange(newValue)
  }

  const handleOnChange: TextFieldProps['onChange'] = (e) => {
    const valueFromEvent = e.currentTarget.value

    const newMatchedArray = memoizedFilterSuggestions(
      valueFromEvent,
      suggestions,
      Boolean(ignoreCase),
      getSuggestionValue
    )

    setActiveIndex(newMatchedArray.length > 0 ? 0 : -1)
    setValue(valueFromEvent)
    fireOnChange(valueFromEvent)
  }

  const getMatchedSuggestions = () => {
    return memoizedFilterSuggestions(
      value,
      suggestions,
      Boolean(ignoreCase),
      getSuggestionValue
    ) as T[]
  }

  const handleOnKeyDown: TextFieldProps['onKeyDown'] = (e) => {
    if (activeIndex === -1) return

    const { keyCode } = e

    const allowedKeyCodes = [
      KeyEnum.TAB,
      KeyEnum.ENTER,
      KeyEnum.UP_ARROW,
      KeyEnum.DOWN_ARROW
    ]

    if (allowedKeyCodes.includes(keyCode)) {
      e.preventDefault()
    }

    if (
      navigate &&
      (keyCode === KeyEnum.DOWN_ARROW || keyCode === KeyEnum.UP_ARROW)
    ) {
      const matchedSuggestions = getMatchedSuggestions()
      setActiveIndex(
        keyCode === KeyEnum.DOWN_ARROW
          ? getNextSafeIndexFromArray(matchedSuggestions, activeIndex)
          : getPreviousSafeIndexFromArray(matchedSuggestions, activeIndex)
      )
    }
  }

  const handleOnKeyUp: TextFieldProps['onKeyUp'] = (e) => {
    const { keyCode } = e

    if (
      activeIndex >= 0 &&
      (keyCode === KeyEnum.TAB ||
        keyCode === KeyEnum.ENTER ||
        keyCode === KeyEnum.RIGHT_ARROW)
    ) {
      const matchedSuggestions = getMatchedSuggestions()
      const matchedValue = matchedSuggestions[activeIndex]

      const newValue = getSuggestionValue
        ? getSuggestionValue(matchedValue)
        : String(matchedValue)

      setValue(newValue)

      fireOnChange(newValue)

      onMatch && onMatch(matchedValue)
    }
  }

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
        value={value}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        onKeyDown={handleOnKeyDown}
        onKeyUp={handleOnKeyUp}
      />
      <Suggestion
        value={value}
        needle={getNeedle()}
        shouldRenderSuggestion={shouldRenderSuggestion}
      />
    </span>
  )
}

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
}
