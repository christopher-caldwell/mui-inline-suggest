import React, { FC } from 'react'
import TextField, { TextFieldProps } from '@material-ui/core/TextField'

const Input: FC<TextFieldProps> = (props) => (
  <TextField {...props} />
)

export default Input
