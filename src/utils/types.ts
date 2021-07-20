export type ShouldRenderSuggestionFn = (value: string) => boolean;

export type GetSuggestionValueFn<T> = (obj: T) => string;
