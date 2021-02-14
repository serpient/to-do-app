import React, { useEffect, useState } from 'react'
import './App.scss'
import { ChakraProvider, Checkbox, Spinner } from '@chakra-ui/react'
import { Todos, ApiTodo, Todo, sortTodos, adaptTodo } from './data/todos'
import { getTodoRequest, updateTodoRequest } from './utils/todoRequest'

function App() {
  const [todos, setTodos] = useState<Todos>({})
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    getTodoRequest()
      .then(todos => {
        const adaptedTodos: Todos = {}
        todos.forEach((todo: ApiTodo) => {
          adaptedTodos[todo.id] = adaptTodo(todo)
        })
        setTodos(adaptedTodos)
      })
      .catch(err => {
        setError(`${err.name} - ${err.message}`)
      })
  }, [])

  const toggleTodoCompletion = async (
    todoId: string,
    currentTodoStatus: boolean
  ): Promise<void> => {
    todos[todoId].isUpdating = true
    setTodos({ ...todos })
    setError(null)
    const requestBody = JSON.stringify({
      isComplete: !currentTodoStatus
    })
    updateTodoRequest(todoId, requestBody)
      .then(response => {
        if (response.status === 'success') {
          todos[todoId].isComplete = !currentTodoStatus
          todos[todoId].isUpdating = false
          setTodos({ ...todos })
        }
      })
      .catch(err => {
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
