import './App.css';
import {useState, useEffect} from 'react'
import { BsFillTrashFill } from 'react-icons/bs'

const API = 'http://localhost:5000'

function App() {

  const [title, setTtitle] = useState("")
  const [time, setTime] = useState("")
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false) 

  //fazendo um loading
  useEffect(() => {

    const loadData = async () => {
      setLoading(true)

      const res = await fetch(API + '/todos')
      .then(res => res.json())
      .then((data) => data)
      .catch(err => console.log(err))

      setLoading(false)
      setTodos(res)
    }

    loadData()
  }, [])

  //enviado para API json-server
  const handleSubmit = async e => {
    e.preventDefault()
    const todo = {
      id: Math.random(),
      title,
      time,
      done: false
    }

    await fetch(API + '/todos', {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type":"application/json"
      }
    })

    setTodos((prevState) => [...prevState, todo])

    setTtitle("")
    setTime("")
  }

  const handleDelete = async (id) => {
    await fetch(API + "/todos/" + id, {
      method: "DELETE"
    })

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id))
  }

  return (
    <div className="App">
      <div className='todo-header'>
        <h1>TodoList</h1>
      </div>
      <div className='form-todo'>
        <h2>Qual sua próxima tarefa: </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title">Tarefa: </label>
            <input type="text" name="title" placeholder='Nome da tarefa...' onChange={e => setTtitle(e.target.value)} value={title || ''} required/>
          </div>
          <div className="form-control">
            <label htmlFor="time">Duração da tarefa: </label>
            <input type="text" name='time' placeholder='Duração (em horas)' onChange={e => setTime(e.target.value)}  value={time || ""}required/>
            <input type="submit" value="criar tarefa" />
          </div>
        </form>
      </div>
      <div className='list-todo'>
        <h2>Lista de tarefas: </h2>
        {todos.map((todo) => (
          <div className="todo" key={todo.id}>
            <h3>{todo.title}</h3>
            <p>Duração: {todo.time}</p>
            <div className="actions">
              <span>
                {!todo.done && <BsFillTrashFill onClick={() => handleDelete(todo.id)}/> }
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
