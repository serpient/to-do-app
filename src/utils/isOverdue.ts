import { Todo } from '../data/todos'

export const isOverdue = (todo: Todo): boolean => {
  return (todo.dueDate && !todo.isComplete && new Date(todo.dueDate) < new Date()) || false
}
