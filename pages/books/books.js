import { getBooks, getAuthors } from '../../scripts/airtable'
import { handleUploadImage } from '../../scripts/cloudinary'

import './books.scss'

//
// Add image
//
const handleAddImage = () => {
  const input = document.querySelector('input[type="file"]')
  if (!input) return

  input.addEventListener('change', () => {
    if (input.files && input.files[0]) {
      console.log(input.files[0])
      const img = document.querySelector('.add-book__image')
      img.onload = () => {
        URL.revokeObjectURL(img.src)
      }

      img.src = URL.createObjectURL()
    }
  })

}

handleAddImage()

//
// Add new book
//
const handleAddBook = (file) => {
  const button = document.querySelector('.add-book__add')
  if (!button) return

  button.addEventListener('click', () => {
    console.log('click')
    addBook(file)
  })
}

handleAddBook()

//
// create books list
//
const createBooksHtml = async () => {
  const books = document.querySelector('.books-page .books')
  if (!books) return

  const booksData = await getBooks()
  const authorsData = await getAuthors()

  console.log(booksData)
  console.log(authorsData)

  books.innerHTML = booksData
    .map(book => {
      const author = authorsData.find(
        author => author.id === book.fields.Author[0]
      )

      return `
        <div class="book">
          <div class="book__img">
            <img src=${
              book.fields['Cover Photo']
                ? book.fields['Cover Photo'][0].thumbnails.large.url
                : ''
              } alt='${book.fields.Name}' 
            />
          </div>

          <span class="book__title">${book.fields.Name}</span>

          <div class="book__synopsis">
            <p>${book.fields.Synopsis}</p>
          </div>

          <span class="book__author">${author.fields.Name}</span>

          <button class="books-page__button book__remove">Remove book</button>
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
      button.closest('.book').remove()
    })
  })
}

//
// add upload-widget script (for Vite issue)
//
const addUploadWidgetScript = () => {
  const script = document.createElement('script');
  script.setAttribute('src', 'https://upload-widget.cloudinary.com/global/all.js')
  script.setAttribute('type', 'text/javascript')
  document.head.prepend(script)
}

//
// async start books page
//
const startBooksPage = async () => {
  if (!document.querySelector('.books-page')) return
  addUploadWidgetScript()
  await createBooksHtml()
  handleUploadImage('.add-book__upload-image')
  document.querySelector('.books-page').style.opacity = 1
  removeBook()
}

window.addEventListener('DOMContentLoaded', () => {
  startBooksPage()
});
