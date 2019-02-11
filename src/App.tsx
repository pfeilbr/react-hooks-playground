import React, { Component, useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

const sleep = (ms = 0) => (new Promise(r => setTimeout(r, ms)))

interface User {
  id: number,
  name: string,
  age: number,
  isLoading: boolean
}

const users = [
  {
    "id": 0,
    "name": "Tricia",
    "age": 44
  },  
  {
    "id": 1,
    "name": "Brian",
    "age": 41
  },
  {
    "id": 2,
    "name": "Wyatt",
    "age": 13
  },
  {
    "id": 3,
    "name": "Max",
    "age": 9
  }  
]

const fetchUser = async (id: number) => {
  // simulate server delay
  await sleep(1000)
  return users.find((user) => (user.id === id))
}

interface MyComponentProps {
  title: string
}

const MyComponent = (props: MyComponentProps) => {
  const defaultUserId = 1
  const initialState: User = {id: defaultUserId, isLoading: true, name: "", age: 0}
  const [state, setState] = useState(initialState)

  // creating inner async function since the function passed to `useEffect`
  // can not be `async`
  const loadUser = async (id: number) => {
    setState(initialState)
    const user = await fetchUser(id)
    setState(Object.assign({}, user, {isLoading: false}))
    return null  
  }

  const handleUserIdChange = (e: any) => {
    const userid: string = e.target.value
    const id = parseInt(userid)
    if (!isNaN(id)) {
      loadUser(id)
    }
  }

  useEffect(() => {
    loadUser(defaultUserId)
  }, [])

  return (
    <div>
      <h1>{props.title}</h1>
      {
        state.isLoading ? (<div>loading ... </div>) :
        (
          <>
            <div>id: {state.id}</div>
            <div>name: {state.name}</div>
            <div>age: {state.age}</div>
          </>
        )
      }
      <div>
        <br />
        <span>userid:</span>
        <input defaultValue={`${defaultUserId}`} onChange={handleUserIdChange}/>
        <div>
          <em>change userid to load a different user</em>
        </div>
      </div>
    </div>
  )
}

class App extends Component {
  render() {
    return (
      <MyComponent title="User Details" />
    );
  }
}

export default App;
