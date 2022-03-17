import { createBooksElements } from '../books/books'
import { getData, updateItem } from '../../scripts/airtable'
import { setHeader } from '../../scripts/header'

//
// unlike book
//
const unlikeBook = user => {
  const buttons = document.querySelectorAll('.book__remove')
  const userId = sessionStorage.userId
  if (!buttons.length) return

  buttons.forEach(button => {
    const bookId = button.dataset.id
    
    button.addEventListener('click', async () => {
      const bookmarks = sessionStorage.userBookmarks.split(',').filter(bId => bId !== bookId)
      if (userId) {
        await updateItem('Users', { itemId: userId, bookmarks })
      }
      sessionStorage.setItem('userBookmarks', bookmarks)

      const parent = button.closest('.book')
      Array.from(parent.children).forEach(child => (child.style.transform = 'scale(0)'))
      setTimeout(() => {
        button.closest('.book').remove()
      }, 300)
    })
  })
}

//
// async start bookmarks page
//
const startBookmarksPage = async () => {
  setHeader()
  if (!document.querySelector('.bookmarks-page')) return
  let booksData = await getData('Books')
  let users
  let user
  if (sessionStorage.userId) {
    users = await getData('Users')
    user = users.find(user => user.id === sessionStorage.userId)
    const userBookmarks = user?.fields?.Bookmarks ?? []
    booksData = booksData.filter(book => userBookmarks.includes(book.id))
    sessionStorage.setItem('userBookmarks', user.fields.Bookmarks)
  } else {
    const userBookmarks = sessionStorage.userBookmarks
    if (!userBookmarks) {
      const heading = document.createElement('h2')
      heading.style.color = '#fff'
      heading.style.padding = '10rem'
      heading.style.margin = '0 auto'
      heading.textContent = 'No bookmarks yet'
      document.querySelector('main').before(heading)
      return
    }
    booksData = booksData.filter(book => sessionStorage.userBookmarks.includes(book.id))
  }
  booksData.sort((b, a) => a.createdTime.localeCompare(b.createdTime))
  const authorsData = await getData('Authors')
  createBooksElements({ selector: '.bookmarks-page .books', authorsData, booksData, buttonLabel: 'Unlike' })
  unlikeBook(user)
  document.querySelector('.bookmarks-page').style.opacity = 1
}

window.addEventListener('DOMContentLoaded', () => {
  startBookmarksPage()
})
