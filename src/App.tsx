import React, { useEffect, useState } from 'react'
import './App.scss'
import {
  ChakraProvider,
  Checkbox,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react'
import { Todos, ApiTodo, sortTodos, adaptTodo } from './data/todos'
import { getTodosRequest, updateTodoRequest, isOverdue } from './utils'

const App = () => {
  const [todos, setTodos] = useState<Todos>({})
  const [isLoading, setLoaderStatus] = useState<boolean>(true)
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    setError(null)
    setLoaderStatus(true)
    getTodosRequest()
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
      .finally(() => {
        setLoaderStatus(false)
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
        <div className="card">
          {error && (
            <div className="error">
              <Alert status="error">
                <AlertIcon />
                <AlertTitle mr={2}>Something went wrong!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}
          <div className="card-header">
            <h1>To Do</h1>
          </div>
          {isLoading ? (
            <div className="center">
              <Spinner
                thickness="8px"
                speed="0.65s"
                emptyColor="gray.200"
                color="gray.500"
                size="xl"
              />
            </div>
          ) : (
            <TodoCollection todos={todos} toggleTodoCompletion={toggleTodoCompletion} />
          )}
        </div>
      </div>
    </ChakraProvider>
  )
}

export default App

const TodoCollection = ({
  todos,
  toggleTodoCompletion
}: {
  todos: Todos
  toggleTodoCompletion: (id: string, isComplete: boolean) => void
}): JSX.Element => {
  if (Object.values(todos).length === 0) {
    return (
      <div className="no-todos-container">
        <h2>Nothing to do here!</h2>
      </div>
    )
  }
  return (
    <React.Fragment>
      {sortTodos(todos).map(todo => {
        return (
          <div
            className={`todo-container ${todo.isComplete ? 'todo-container--complete' : ''} ${
              isOverdue(todo) ? 'todo-container--overdue' : ''
            }`}
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
    </React.Fragment>
  )
}
