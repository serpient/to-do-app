/* eslint-disable no-undef */
/* eslint-disable jest/valid-expect */
/* eslint-disable no-unused-expressions */
/* eslint-disable jest/valid-expect-in-promise */
import { ApiEndpoints } from '../../src/utils'

describe('Get Todo Flow', () => {
  beforeEach(() => {
    cy.server()
  })

  it('on successful fetch, it renders sorted todos with date if available and checked if completed', () => {
    cy.fixture('todos').then(todosJson => {
      cy.intercept('GET', ApiEndpoints.get(), todosJson).as('todosStub')
    })

    cy.visit('http://localhost:3000')
    cy.wait(['@todosStub'])

    cy.get('#card-content').children('.todo-container').should('have.length', 6)
    cy.get('#card-content')
      .children('.todo-container')
      .then(todos => {
        verifyInitialTodoState(todos)
      })
  })

  it('on successful fetch, it shows a no to do message to users', () => {
    cy.intercept('GET', ApiEndpoints.get(), []).as('todosStub')

    cy.visit('http://localhost:3000')
    cy.wait(['@todosStub'])

    cy.get('#card-content').children('.todo-container').should('have.length', 0)
    cy.findByRole('heading', { name: /Nothing to do here!/i })
  })

  it('on failed fetch, it displays the error message', () => {
    cy.intercept('GET', ApiEndpoints.get(), {
      error: { name: 'ERROR', message: 'MISSING API KEY' }
    }).as('todosStub')

    cy.visit('http://localhost:3000')
    cy.wait(['@todosStub'])

    cy.get('#card-content').children('.todo-container').should('have.length', 0)
    cy.findByRole('heading', { name: /Nothing to do here!/i })
    cy.findByText(/error - missing api key/i)
  })
})

describe('Update Todo Flow', () => {
  it('resorts the list after successful toggling of todo', () => {
    cy.fixture('todos').then(todosJson => {
      cy.intercept('GET', ApiEndpoints.get(), todosJson).as('todosStub')
    })
    cy.visit('http://localhost:3000')
    cy.wait(['@todosStub'])

    cy.intercept('PATCH', ApiEndpoints.update('5'), { status: 'success' }).as('updateStub')
    cy.findByRole('checkbox', { name: /buy cat supplies/i }).click()
    cy.wait(['@updateStub'])
    cy.get('#card-content')
      .children('.todo-container')
      .then(todos => {
        expect(todos[0]).to.contain.text('Pick up new covid catsOVERDUE06/26/2020')
        expect(todos[0].querySelector('input')).not.to.be.checked

        expect(todos[1]).to.contain.text('Consider a 3rd cat03/21/2021')
        expect(todos[1].querySelector('input')).not.to.be.checked

        expect(todos[2]).to.contain.text('Drink water')
        expect(todos[2].querySelector('input')).not.to.be.checked

        expect(todos[3]).to.contain.text('Check out Lange Foundation cats03/10/2020')
        expect(todos[3].querySelector('input')).to.be.checked

        // todo in question has been resorted into new position
        expect(todos[4]).to.contain.text('Buy cat supplies06/24/2020')
        expect(todos[4].querySelector('input')).to.be.checked

        expect(todos[5]).to.contain.text('Go for a walk')
        expect(todos[5].querySelector('input')).to.be.checked
      })

    // can also re-toggle the todo
    cy.findByRole('checkbox', { name: /buy cat supplies/i }).click()
    cy.get('#card-content')
      .children('.todo-container')
      .then(todos => {
        verifyInitialTodoState(todos)
      })
  })

  it('renders an error message if update failed; no change occurs', () => {
    cy.fixture('todos').then(todosJson => {
      cy.intercept('GET', ApiEndpoints.get(), todosJson).as('todosStub')
    })
    cy.visit('http://localhost:3000')
    cy.wait(['@todosStub'])

    cy.intercept('PATCH', ApiEndpoints.update('5'), {
      error: { name: 'UPDATE_ERROR', message: 'INVALID REQUEST' }
    }).as('updateStub')
    cy.findByRole('checkbox', { name: /buy cat supplies/i }).click()
    cy.wait(['@updateStub'])
    cy.findByText(/update_error - invalid request/i)
    cy.get('#card-content')
      .children('.todo-container')
      .then(todos => {
        verifyInitialTodoState(todos)
      })
  })
})

const verifyInitialTodoState = todos => {
  expect(todos[0]).to.contain.text('Buy cat suppliesOVERDUE06/24/2020')
  expect(todos[0].querySelector('input')).not.to.be.checked

  expect(todos[1]).to.contain.text('Pick up new covid catsOVERDUE06/26/2020')
  expect(todos[1].querySelector('input')).not.to.be.checked

  expect(todos[2]).to.contain.text('Consider a 3rd cat03/21/2021')
  expect(todos[2].querySelector('input')).not.to.be.checked

  expect(todos[3]).to.contain.text('Drink water')
  expect(todos[3].querySelector('input')).not.to.be.checked

  expect(todos[4]).to.contain.text('Check out Lange Foundation cats03/10/2020')
  expect(todos[4].querySelector('input')).to.be.checked

  expect(todos[5]).to.contain.text('Go for a walk')
  expect(todos[5].querySelector('input')).to.be.checked
}
