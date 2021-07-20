# Material UI Inline Suggest Text Field

A tiny component to provide the auto complete / suggestions similar to a terminal.

Took a lot of inspiration from [react-inline-suggest](https://www.npmjs.com/package/react-inline-suggest), That repo has been archived, and the last publish was 4 years ago.

<p align="center">
  <h4/>
  <img src="https://img.shields.io/npm/v/@caldwell619/mui-inline-suggest">
  <img src="https://img.shields.io/bundlephobia/min/@caldwell619/mui-inline-suggest">
  <img src="https://img.shields.io/github/last-commit/christopher-caldwell/mui-inline-suggest">
  <img src="https://img.shields.io/npm/types/@caldwell619/mui-inline-suggest">
</p>

## Demo

URL coming soon

_Sorry for the GIF quality._

<p>
  <img src="./docs/no-outline.gif"/>
  <img src='./docs/outlined.gif' />
</p>

## Install

```bash
yarn add @caldwell619/mui-inline-suggest
# or
npm install --save @caldwell619/mui-inline-suggest
```

## Usage

```tsx
import { InlineSuggest } from '@caldwell619/mui-inline-suggest'

const Component = () => (
  <InlineSuggest
    textFieldProps={{ label: 'Test!', variant: 'outlined' }}
    suggestions={['hYEY!']}
  />
)
```

## License

MIT © [christopher-caldwell](https://github.com/christopher-caldwell)
