import { GetSuggestionValueFn } from './types'

export const filterSuggestions = <T>(
  value: string,
  suggestions: T[],
  ignoreCase: boolean,
  getSuggestionValue?: GetSuggestionValueFn<T>
) => {
  if (!value) {
    return []
  }

  const rx = RegExp(`^${value}`, ignoreCase ? 'i' : undefined)
  return suggestions.filter(suggestion =>
    getSuggestionValue ? rx.test(getSuggestionValue(suggestion)) : rx.test(String(suggestion))
  )
}

export const getNeedleFromString = (text: string, current: string) => {
  return text.replace(text.substr(0, current.length), '')
}

export const getNextSafeIndexFromArray = <T>(array: T[], current: number) => {
  return current + 1 > array.length - 1 ? 0 : current + 1
}

export const getPreviousSafeIndexFromArray = <T>(array: T[], current: number) => {
  return current - 1 < 0 ? array.length - 1 : current - 1
}

export * from './KeyEnum'
export * from './types'
