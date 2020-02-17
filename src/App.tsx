import React, { useState } from 'react'
import { Grid, Card, CardHeader, CardContent, Container, Divider, TextField, CssBaseline } from '@material-ui/core'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import List, { item } from './Components/List'
import { blue, cyan } from '@material-ui/core/colors'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

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
      checked
    }
  }
`

const DELETE_ITEM = gql`
  mutation DeleteItem($id: String!){
    deleteItem(id: $id)
  }
`

const App = (): JSX.Element => {
  const [error, setError] = useState(false)
  const [input, setInput] = useState<String>('')

  const { loading, error: gqlError, data } = useQuery(ITEMS)
  const [addItem] = useMutation<{addItem: item}>(
    ADD_ITEM,
    {
      update (cache, { data: { addItem } }: any) {
        const { items }: any = cache.readQuery({ query: ITEMS })
        cache.writeQuery({
          query: ITEMS,
          data: { items: items.concat([addItem]) }
        })
      }
    }
  )

  const [deleteItem] = useMutation<{deleteItem: String}>(
    DELETE_ITEM,
    {
      update (cache, { data: { deleteItem } }: any) {
        const { items }: any = cache.readQuery({ query: ITEMS })
        cache.writeQuery({
          query: ITEMS,
          data: { items: items.filter((obj: any) => obj.id !== deleteItem) }
        })
      }
    }
  )

  if (loading) return <div>loading...'</div>
  if (gqlError !== undefined) console.error(gqlError)

  const handleClick = (uid: Number): void => {
  // const index = items.findIndex(obj => obj.uid === uid)
    // const newItems = [...items]
    // newItems[index].checked = !newItems[index].checked
    // setItems(newItems)
  }

  const handleDelete = (id: String): void => {
  // setItems(items.filter(item => item.uid !== uid))
    deleteItem({ variables: { id } }).catch(e => console.log(e))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (input !== '') {
      addItem({ variables: { title: input, checked: false } }).catch(e => console.log(e))
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
                  <List items={data.items} handleDelete={(id: String) => handleDelete(id)} handleClick={() => handleClick(data.id)} />
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
