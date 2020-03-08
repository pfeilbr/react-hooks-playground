import React, {
  Component,
  createContext,
  useState,
  useEffect,
  useContext
} from "react";
import logo from "./logo.svg";
import "./App.css";
import styled from "styled-components";

const sleep = (ms = 0) => new Promise(r => setTimeout(r, ms));

interface User {
  id: number;
  name: string;
  age: number;
  isLoading: boolean;
}

const users = [
  {
    id: 0,
    name: "Tricia",
    age: 44
  },
  {
    id: 1,
    name: "Brian",
    age: 41
  },
  {
    id: 2,
    name: "Wyatt",
    age: 13
  },
  {
    id: 3,
    name: "Max",
    age: 9
  }
];

// context example
const CurrentUser = createContext(users[0]);

const fetchUser = async (id: number) => {
  // simulate server delay
  await sleep(1000);
  return users.find(user => user.id === id);
};

interface MyComponentProps {
  title: string;
}

interface UserDetailProps {
  id: number;
  name: string;
  age: number;
}

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;

  ::before {
    content: "🚀";
  }

  :hover {
    color: lightblue;
  }
`;

const Section = styled.section`
  padding: 4em;
  background: papayawhip;
`;

const Input = styled.input`
  padding: 0.5em;
  margin: 0.5em;
  color: palevioletred;
  background: papayawhip;
  border: none;
  border-radius: 3px;
`;

const UserDetails = (props: UserDetailProps) => (
  <Section>
    <div>id: {props.id}</div>
    <div>name: {props.name}</div>
    <div>age: {props.age}</div>
  </Section>
);

const UserDetailsUsingUserContext = () => {
  const user = useContext(CurrentUser);
  return <UserDetails {...user} />;
};

const MyComponent = (props: MyComponentProps) => {
  const defaultUserId = 1;
  const initialState: User = {
    id: defaultUserId,
    isLoading: true,
    name: "",
    age: 0
  };

  const [state, setState] = useState(initialState);
  const currentUserContext = useContext(CurrentUser);

  // creating inner async function since the function passed to `useEffect`
  // can not be `async`
  const loadUser = async (id: number) => {
    setState(initialState);
    const user = await fetchUser(id);
    setState(Object.assign({}, user, { isLoading: false }));
    return null;
  };

  const handleUserIdChange = (e: any) => {
    const userid: string = e.target.value;
    const id = parseInt(userid);
    if (!isNaN(id)) {
      loadUser(id);
    }
  };

  useEffect(() => {
    loadUser(defaultUserId);
  }, []);

  // define custom hook.  generates todos
  const useTodos = () => {
    let lastId = 0;
    const [todos, setTodos] = useState([
      { id: lastId, text: `todo #${lastId}` }
    ]);

    useEffect(() => {
      setInterval(() => {
        const id = new Date().getTime();
        lastId = lastId + 1;
        const text = `todo #${lastId}`;
        todos.push({ id, text });
        setTodos([...todos]); // NOTE: must use new array for hooks to detect
        console.log(todos.length);
      }, 1000);
    }, []);

    return todos;
  };

  // use custom hook
  const todos = useTodos();

  return (
    <CurrentUser.Provider value={state}>
      <div>
        <Title>{props.title}</Title>
        {state.isLoading ? <div>loading ... </div> : <UserDetails {...state} />}
        <div>
          <br />
          <span>userid:</span>
          <Input
            defaultValue={`${defaultUserId}`}
            onChange={handleUserIdChange}
          />
          <div>
            <em>change userid to load a different user</em>
          </div>
        </div>
        <hr />
        <h3>Context Example</h3>
        <div>
          <UserDetailsUsingUserContext />
        </div>
        <hr />
        <h3>Todos</h3>
        <div>
          {todos.map(todo => {
            return <div key={todo.id}>{todo.text}</div>;
          })}
        </div>
      </div>
    </CurrentUser.Provider>
  );
};

class App extends Component {
  render() {
    return <MyComponent title="User Details" />;
  }
}

export default App;
