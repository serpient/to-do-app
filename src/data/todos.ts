import { formatDate } from '../utils'

export interface ApiTodo {
  id: string
  description: string
  isComplete: boolean
  dueDate?: Date
}

export interface Todo {
  id: string
  description: string
  isComplete: boolean
  dueDate?: Date
  formattedDueDate?: string
  isUpdating: boolean
}

export interface Todos {
  [todoId: string]: Todo
}

export interface ApiUpdateResponse {
  status: string
}

export const adaptTodo = (apiTodo: ApiTodo): Todo => {
  return {
    ...apiTodo,
    formattedDueDate: apiTodo.dueDate ? formatDate(apiTodo.dueDate) : undefined,
    isUpdating: false
  }
}

export const sortTodos = (todos: Todos): Todo[] => {
  const overdue: Todo[] = []
  const normal: Todo[] = []
  const completed: Todo[] = []

  Object.values(todos).forEach((todo: Todo) => {
    if (todo.isComplete) {
      completed.push(todo)
    } else if (todo.dueDate && new Date(todo.dueDate) < new Date()) {
      overdue.push(todo)
    } else {
      normal.push(todo)
    }
  })

  return [...sortBySoonest(overdue), ...sortBySoonest(normal), ...sortBySoonest(completed)]
}

export const sortBySoonest = (todos: Todo[]): Todo[] => {
  return todos.sort((a, b) => {
    if (a.dueDate === b.dueDate) {
      return 0
    }
    if (!a.dueDate) {
      return 1
    }
    if (!b.dueDate) {
      return -1
    }
    if (a.dueDate < b.dueDate) {
      return -1
    }
    if (a.dueDate > b.dueDate) {
      return 1
    }
    return 0
  })
}
