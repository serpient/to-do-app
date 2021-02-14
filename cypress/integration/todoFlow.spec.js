describe('Todo Flow', () => {
  it('renders todos', () => {
    cy.visit('http://localhost:3000')
  })
})

// renders all todos
// correctly checkmarked
// correctly with formatted date if has it
// sorted in right order

// renders message if no todos
// renders error  mesage if failed fetching

// updating
// clicking on todo toggles the completion
// resorts as necesasry

// renders error mesage if update failed - no change occurs to completion
