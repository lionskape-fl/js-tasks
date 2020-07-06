import { Component, memo } from 'react'
import api from './api' // some realtime API

/*
item: {
  id: string,
  title: string,
  text: string,
  likes: number
}
*/

const Item = memo(
  props => (
    <div>
      <p>{props.title}</p>
      <p>{props.text}</p>
    </div>
  ),
  (prevProps, nextProps) => prevProps.id === nextProps.id
)

class NewsFeed extends Component {
  state = {
    top: []
  }

  handleNewItem = item => {
    this.setState((previousState) => ({
      top: [...previousState.top, item].sort((a, b) => b.likes - a.likes).slice(0, 100)
    }))
  }

  handleDeleteItem = id => {
    this.setState((previousState) => ({
      top: previousState.top.filter(item => item.id !== id)
    }))
  }

  componentDidMount() {
    api.on('newItem', this.handleNewItem)
    api.on('deleteItem', this.handleDeleteItem)
  }

  componentWillUnmount() {
    api.off('newItem', this.handleNewItem)
    api.off('deleteItem', this.handleDeleteItem)
  }

  render() {
    return (
      <div>
        <p>Top 100 news:</p>
        {this.state.top.map(item =>
          <Item title={item.title} text={item.text} key={item.id} />
        )}
      </div>
    )
  }
}

export default NewsFeed
