import { getData, addItem, updateItem } from '../../scripts/airtable'
import { handleUploadImage, addUploadWidgetScript } from '../../scripts/cloudinary'

//
// Add new book
//
const handleAddBook = async (authorsData) => {
  const button = document.querySelector('.add-book__add')
  if (!button) return

  button.addEventListener('click', async () => {
    const input = document.querySelector('.add-book__title')
    const title = input.value
    const textarea = document.querySelector('.add-book__synopsis')
    const synopsis = textarea.value
    const select = document.querySelector('.add-book__author')
    const authorId = select.value
    const authorName = select.options[select.selectedIndex].text
    const coverUrl = document.querySelector('.add-book__upload-image').dataset.url

    if (!coverUrl || !title || !synopsis || !authorId) return

    const fields = {
      'Cover Photo': [{ url: coverUrl }],
      Author: [authorId],
      Synopsis: synopsis,
      Name: title,
      Shown: true
    }

    const newBook = await addItem('Books', fields)

    const books = document.querySelector('.books-page .books')
    const book = document.createElement('div')
    book.classList.add('book')
    book.innerHTML = `
      <div class="book__img"><img src=${coverUrl} alt='${title}'/></div>
      <span class="book__title clm2">${title}</span>
      <div class="book__synopsis clm3"><p>${synopsis}</p></div>
      <span class="book__author clm4">${authorName}</span>
      <button class="books-page__button book__remove btn" data-id="${newBook.records[0].id}">Remove book</button>
    `
    books.prepend(book)

    input.value = ''
    textarea.value = ''
    const addImageButton = document.querySelector('.add-book__upload-image')
    addImageButton.textContent = 'Add cover'
    addImageButton.disabled = false
  })
}

//
// add select element
//
const addSelectElement = authorsData => {
  const select = document.querySelector('.add-book__author')
  const options = authorsData.map(author => `<option value="${author.id}">${author.fields.Name}</option>`)
  select.innerHTML = options.join('')
}

//
// create books list
//
export const createBooksElements = ({selector, authorsData, booksData, buttonLabel}) => {
  const books = document.querySelector(selector)
  if (!books) return

  books.innerHTML = booksData
    .filter(book => book.fields.Shown)
    .map(book => {
      const author = authorsData.find(author => author.id === book.fields.Author[0])

      return `
        <div class="book">
          <div class="book__img">
            <img
              src=${book.fields['Cover Photo'] ? book.fields['Cover Photo'][0].thumbnails.large.url : ''}
              alt='${book.fields.Name}' 
            />
          </div>
          <span class="book__title clm2">${book.fields.Name}</span>
          <div class="book__synopsis clm3"><p>${book.fields.Synopsis}</p></div>
          <span class="book__author clm4">${author.fields.Name}</span>
          <button class="books-page__button book__remove btn" data-id="${book.id}">${buttonLabel}</button>
        </div>
      `
    })
    .join('')
}

//
// remove book
//
const removeBook = () => {
  const buttons = document.querySelectorAll('.book__remove')
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const parent = button.closest('.book')
      Array.from(parent.children).forEach(child => (child.style.transform = 'scale(0)'))
      setTimeout(() => {
        button.closest('.book').remove()
      }, 300)
      updateItem('Books', {itemId: button.dataset.id, shown: false})
    })
  })
}

//
// async start books page
//
const startBooksPage = async () => {
  if (!document.querySelector('.books-page')) return
  addUploadWidgetScript()
  const booksData = await getData('Books')
  booksData.sort((b, a) => a.createdTime.localeCompare(b.createdTime))
  const authorsData = await getData('Authors')
  addSelectElement(authorsData)
  createBooksElements({selector: '.books-page .books', authorsData, booksData, buttonLabel: 'Remove book'})
  document.querySelector('.books-page').style.opacity = 1
  await handleAddBook(authorsData)
  removeBook()
}

window.addEventListener('DOMContentLoaded', () => {
  startBooksPage()
})

window.onload = () => {
  handleUploadImage('.add-book__upload-image')
}
