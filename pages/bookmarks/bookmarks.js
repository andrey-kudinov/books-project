import { createBooksElements } from '../books/books'
import { getData, updateItem } from '../../scripts/airtable'

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
  if (!document.querySelector('.bookmarks-page')) return
  let booksData = await getData('Books')
  let users
  let user
  if (sessionStorage.userId) {
    users = await getData('Users')
    user = users.find(user => user.id === sessionStorage.userId)
    booksData = booksData.filter(book => user?.fields.Bookmarks.includes(book.id))
    sessionStorage.setItem('userBookmarks', user.fields.Bookmarks)
  } else {
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
