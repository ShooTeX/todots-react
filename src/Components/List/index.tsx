import React from 'react'
import { List, ListItem, ListItemIcon, Checkbox, ListItemText } from '@material-ui/core'

export interface item {
  title: String
  checked: boolean
  uid: number
}

interface Props {
  handleClick: Function
  items: item[]
}

const ListComponent = ({ handleClick, items }: Props): JSX.Element => (
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
      </ListItem>
    ))}
  </List>
)

export default ListComponent
