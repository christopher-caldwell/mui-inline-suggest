import React from 'react'

import { InlineSuggest } from '@caldwell619/mui-inline-suggest'

const App = () => {
  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <InlineSuggest suggestions={['hYEY!']} />
    </div>
  )
}

export default App
