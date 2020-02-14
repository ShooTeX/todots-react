import React from 'react'
import { List, ListItem, ListItemIcon, Checkbox, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core'
import { Delete } from '@material-ui/icons'

export interface item {
  title: String
  checked: boolean
  uid: number
}

interface Props {
  handleClick: Function
  handleDelete: Function
  items: item[]
}

const ListComponent = ({ handleDelete, handleClick, items }: Props): JSX.Element => (
  <List>
    {items.map((item: item) => (
      <ListItem key={item.uid} role={undefined} dense button onClick={() => handleClick(item.uid)}>
        <ListItemIcon>
          <Checkbox
            checked={item.checked}
            edge='start'
            tabIndex={-1}
          />
        </ListItemIcon>
        <ListItemText primary={item.title} />
        <ListItemSecondaryAction onClick={() => handleDelete(item.uid)}>
          <IconButton edge='end' aria-label='delete'>
            <Delete color='error' />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    ))}
  </List>
)

export default ListComponent
