import React from 'react'
import './App.css';
import Board from './components/Board'
import Home from './components/pages/Home'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import PageNotFound from './components/pages/PageNotFound'
import {boardsRef, listsRef, cardsRef} from './firebase'
import AuthProvider from './components/AuthContext'
import UserForm from './components/UserForm'
import Header from './components/Header'

class App extends React.Component{
  state = {
    boards: []
  }
  getBoards = async userId => {
    try {
      this.setState({ boards: []})
      const boards = await boardsRef
      .where('board.user', '==', userId)
      .orderBy('board.createdAt')
      .get()
      boards.forEach(board => {
        const data = board.data().board
        const boardObj = {
          id: board.id,
          ...data
        }
        this.setState({ boards: [...this.state.boards, boardObj]})
      })
    } catch (error) {
      console.log('Error gettings boards ', error)
    }
  }
  createNewBoard = async board => {
    try {
    const newBoard = await boardsRef.add({ board })
    const boardObj = {
      id: newBoard.id,
      ...board
    }
    this.setState({boards: [...this.state.boards, boardObj]})
  } catch(error){
    console.error('Error creating new board: ', error)
  }
}

deleteList = async (listId) => {
  try {
      const cards = await cardsRef
      .where('card.listId', '==', listId)
      .get()
      if(cards.docs.length !== 0) {
          cards.forEach(card => {
              card.ref.delete()
          })
      }
      const list = await listsRef.doc(listId)
      list.delete()
  } catch(error){
      console.error('Error deleting list: ', error)
  }
}

deleteBoard = async boardId => {
  try {
    const lists = await listsRef
    .where('list.board', '==', boardId)
    .get()


    if(lists.docs.length !== 0) {
      lists.forEach(list => {
        this.deleteList(list.ref.id)
      })
    }
    const board = await boardsRef.doc(boardId)
    this.setState({
      boards: [
        ...this.state.boards.filter(board => {
          return board.id !== boardId
        })
      ]
    })
    board.delete()
  } catch(error) {
    console.error('Error deleting board: ', error)
  }
}

updateBoard = async (boardId, newTitle) => {
  try {
    const board = await boardsRef.doc(boardId)
    board.update({ 'board.title': newTitle })
  } catch(error) {
    console.error('Error updating board: ', error)
  }
}
  render () {
  return (
    <div>
      <BrowserRouter>
      <AuthProvider>
      <Header/>
      <Switch>
        <Route exact path="/" component={UserForm}/>
      <Route exact path="/:userId/boards" render={(props)=> ( 
        <Home 
        {...props}
        getBoards = {this.getBoards}
        boards={this.state.boards} 
        createNewBoard={this.createNewBoard}/>
      )}/>
      <Route path="/board/:boardId" 
      render={props => (
        <Board 
        {...props}
        updateBoard={this.updateBoard}
        deleteBoard={this.deleteBoard}
        deleteList={this.deleteList}
        />
        )}
        />
      <Route component={PageNotFound} />
      {/*<Home boards={this.state.boards} 
      createNewBoard={this.createNewBoard}/>
  <Board />*/}
  </Switch>
  </AuthProvider>
      </BrowserRouter>
    </div>
  );
  }
}

export default App;
