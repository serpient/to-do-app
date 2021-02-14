import React, { useEffect, useState } from 'react'
import './App.scss'
import { ChakraProvider, Checkbox, Spinner } from '@chakra-ui/react'
import { ApiEndpoints } from './utils'
import { Todos, ApiTodo, Todo, sortTodos, adaptTodo } from './data/todos'
require('dotenv').config()

function App() {
  const [todos, setTodos] = useState<Todos>({})
  const [error, setError] = useState<string | null>()
  const API_KEY: string = process.env.REACT_APP_API_KEY || ''

  useEffect(() => {
    fetch(ApiEndpoints.get(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': API_KEY
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        const adaptedTodos: Todos = {}
        data.forEach((todo: ApiTodo) => {
          adaptedTodos[todo.id] = adaptTodo(todo)
        })
        setTodos(adaptedTodos)
      })
      .catch(err => {
        console.log(err)
        setError(err.message)
      })
  }, [API_KEY])

  const toggleTodoCompletion = (todoId: string, currentTodoStatus: boolean): void => {
    todos[todoId].isUpdating = true
    setTodos({ ...todos })
    setError(null)

    fetch(ApiEndpoints.update(todoId), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': API_KEY
      },
      body: JSON.stringify({
        isComplete: !currentTodoStatus
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          todos[todoId].isComplete = !currentTodoStatus
          todos[todoId].isUpdating = false
          setTodos({ ...todos })
        }
      })
      .catch(err => {
        console.log(err)
        setError(err.message)
        todos[todoId].isUpdating = false
        setTodos({ ...todos })
      })
  }

  return (
    <ChakraProvider>
      <div className="app-container wrapper">
        {error && <div className="error">{error}</div>}
        <div className="card">
          <div className="card-header">
            <h1>To Do</h1>
          </div>
          {sortTodos(todos).map(todo => {
            return (
              <div
                className={`todo-container ${todo.isComplete ? 'todo-container--complete' : ''}`}
                key={todo.id}
                onClick={() => toggleTodoCompletion(todo.id, todo.isComplete)}
              >
                {todo.isUpdating ? (
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="gray.500"
                    size="sm"
                  />
                ) : (
                  <Checkbox isChecked={todo.isComplete} colorScheme="gray" />
                )}
                <div className="row">
                  <p className="description">{todo.description}</p>
                  {todo.formattedDueDate && <div className="tag">{todo.formattedDueDate}</div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </ChakraProvider>
  )
}

export default App
