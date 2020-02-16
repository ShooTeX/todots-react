import React, { useState } from 'react'
import { Grid, Card, CardHeader, CardContent, Container, Divider, TextField, CssBaseline } from '@material-ui/core'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import List, { item } from './Components/List'
import { blue, cyan } from '@material-ui/core/colors'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import uuid4 from 'uuid4'

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: blue,
    secondary: cyan
  }
})

const ITEMS = gql`
  {
    items {
      id
      title
      checked
    }
  }
`

const ADD_ITEM = gql`
  mutation AddItem($title: String!, $checked: Boolean!){
    addItem(title: $title, checked: $checked) {
      id
      title
      chcked
    }
  }
`

const App = (): JSX.Element => {
  const [error, setError] = useState(false)
  const [input, setInput] = useState<String>('')
  const [items, setItems] = useState<item[]>([
    { uid: uuid4(), title: 'item 1', checked: false },
    { uid: uuid4(), title: 'item 2', checked: false }
  ])
  const { loading, error: gqlError, data } = useQuery(ITEMS)

  if (loading) return <div>loading...'</div>
  if (gqlError !== null) console.error(gqlError)

  const handleClick = (uid: Number): void => {
    const index = items.findIndex(obj => obj.uid === uid)
    const newItems = [...items]
    newItems[index].checked = !newItems[index].checked
    setItems(newItems)
  }

  const handleDelete = (uid: number): void => {
    setItems(items.filter(item => item.uid !== uid))
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
      <CssBaseline>
        <Container>
          <Grid container justify='center' alignItems='center' style={{ minHeight: '100vh' }}>
            <Grid item lg={4}>
              <Card elevation={3} variant='elevation'>
                <CardHeader title='TODO' subheader='in typescript' />
                <Divider />
                <CardContent>
                  <List items={data.items} handleDelete={(uid: number) => handleDelete(uid)} handleClick={(uid: number) => handleClick(uid)} />
                  <form noValidate autoComplete='false' onSubmit={(e) => handleSubmit(e)}>
                    <TextField variant='outlined' onChange={(e) => handleChange(e)} value={input} error={error} helperText={error ? "Input can't be empty" : ''} fullWidth />
                  </form>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </CssBaseline>
    </ThemeProvider>
  )
}

export default App
