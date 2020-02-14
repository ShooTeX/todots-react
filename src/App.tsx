import React, { useState } from 'react'
import { Grid, Card, CardHeader, CardContent, Container, Divider, TextField } from '@material-ui/core'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import List, { item } from './Components/List'
import uuid4 from 'uuid4'
import { blue, cyan } from '@material-ui/core/colors'

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: blue,
    secondary: cyan
  }
})

const App = (): JSX.Element => {
  const [error, setError] = useState(false)
  const [input, setInput] = useState<String>('')
  const [items, setItems] = useState<item[]>([
    { uid: uuid4(), title: 'item 1', checked: false },
    { uid: uuid4(), title: 'item 2', checked: false }
  ])

  const handleClick = (uid: Number): void => {
    const index = items.findIndex(obj => obj.uid === uid)
    const newItems = [...items]
    newItems[index].checked = !newItems[index].checked
    setItems(newItems)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (input !== '') {
      setItems([...items, { uid: uuid4(), title: input, checked: false }])
      setInput('')
    } else {
      setError(true)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setError(false)
    setInput(e.target.value)
  }
  return (
    <ThemeProvider theme={darkTheme}>
      {console.log('rendered')}
      <Container>
        <Grid container justify='center' alignItems='center' style={{ minHeight: '100vh' }}>
          <Grid item>
            <Card elevation={3} variant='elevation'>
              <CardHeader title='TODO' subheader='in typescript' />
              <Divider />
              <CardContent>
                <List items={items} handleClick={(uid: number) => handleClick(uid)} />
                <form noValidate autoComplete='false' onSubmit={(e) => handleSubmit(e)}>
                  <TextField variant='outlined' onChange={(e) => handleChange(e)} value={input} error={error} helperText={error ? "Input can't be empty" : ''} />
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  )
}

export default App
