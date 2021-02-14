export const formatDate = (date: Date): string => {
  const newDate = new Date(date)
  const month = newDate.getMonth() + 1
  const day = newDate.getDate()
  const year = newDate.getFullYear()
  return `${prefixZero(month)}/${prefixZero(day)}/${year}`
}

export const prefixZero = (int: number): string => {
  return int < 10 ? `0${int}` : `${int}`
}

export const ApiEndpoints = {
  get: () => `https://944ba3c5-94c3-4369-a9e6-a509d65912e2.mock.pstmn.io/get`,
  update: (todoId: string) =>
    `https://944ba3c5-94c3-4369-a9e6-a509d65912e2.mock.pstmn.io/patch/${todoId}`
}
