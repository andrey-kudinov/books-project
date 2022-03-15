import { getData, updateItem } from './scripts/airtable'

//
// create books list
//
const createBooksElements = (booksData, authorsData) => {
  const booksWrapper = document.querySelector('.main-page .books')
  if (!booksWrapper) return

  booksWrapper.innerHTML = booksData
    .filter(book => book.fields.Shown)
    .map(book => {
      const author = authorsData.find(author => author.id === book.fields.Author[0])

      return `
        <div
          class="book"
          data-author='${author.fields.Name}'
          data-title='${book.fields.Name}'
          data-book-id='${book.id}'
          data-description='${book.fields.Synopsis}'
          data-image=${book.fields['Cover Photo'] ? book.fields['Cover Photo'][0].thumbnails.large.url : ''}
        >
          <img src=${book.fields['Cover Photo'] ? book.fields['Cover Photo'][0].thumbnails.large.url : ''} alt='${
        book.fields.Name
      }' />
        </div>
      `
    })
    .join('')
}

//
// handle book select
//
const handleBookSelect = () => {
  const mainPage = document.querySelector('.main-page')

  if (!mainPage) return

  const books = document.querySelectorAll('.main-page .book')

  books.forEach(book => {
    book.addEventListener('click', () => {
      if (!document.querySelector('.main-page .recently')) {
        const cardsWrapper = document.createElement('section')
        cardsWrapper.classList.add('recently')
        mainPage.prepend(cardsWrapper)
      }

      const { image, title, description, author, bookId } = book.dataset
      let cards = document.querySelectorAll('.main-page .card')

      if (!cards.length) {
        const card = document.createElement('div')
        card.classList.add('recently__card', 'card', 'card_green')
        card.innerHTML = `
          <div class="card__image"><img src=${image} alt="${title}" /></div>

          <div class="card__empty"></div>

          <div class="card__info">
            <h3>${title}</h3>
            <p class="card__desc">${description}</p>
            <p class="card__genre">${author}</p>
            <button>Now Read!</button>
            <label>
              <input
                type="checkbox"
                class="sr-only"
                data-book-id='${bookId}'
              >
              <div class="heart"></div>
            </label>
          </div>
        `
        document.querySelector('.recently').append(card)
      } else {
        if (cards.length === 1) {
          const card = cards[0].cloneNode(true)
          cards[0].parentElement.append(card)
        }

        if (cards[0].dataset.title === title) return

        cards = document.querySelectorAll('.main-page .card')
        cards[1].innerHTML = cards[0].innerHTML
        cards[0].dataset.title = title
        cards[0].innerHTML = `
          <div class="card__image"><img src=${image} alt=${title} /></div>

          <div class="card__empty"></div>

          <div class="card__info">
            <h3>${title}</h3>
            <p class="card__desc">${description}</p>
            <p class="card__genre">${author}</p>
            <button>Now Read!</button>
            <label>
              <input
                type="checkbox"
                class="sr-only"
                data-book-id='${bookId}'
              >
              <div class="heart"></div>
            </label>
          </div>
        `
        cards.forEach(card => card.classList.remove('card_green', 'card_pink'))
        cards[0].classList.add('card_green')
        cards[1].classList.add('card_pink')
      }

      const inputs = document.querySelectorAll('.card input')
      inputs.forEach(input => {
        input.checked = sessionStorage.userBookmarks?.includes(input.dataset.bookId)
      })
      handleLike()
    })
  })
}

//
// open modal
//
const modalOpen = () => {
  const button = document.querySelector('.nav__auth')
  if (!button) return

  const overlay = document.querySelector('.overlay')
  const modal = document.querySelector('.modal')
  const input = document.querySelector('.modal input')

  button.addEventListener('click', () => {
    overlay.style.display = 'grid'
    modal.style.display = 'flex'
    input.focus()
  })
}

//
// close modal
//
const modalClose = () => {
  const button = document.querySelector('.modal .close')
  if (!button) return

  const overlay = document.querySelector('.overlay')
  const modal = document.querySelector('.modal')

  const close = e => {
    overlay.style.display = 'none'
    modal.style.display = 'none'
  }

  button.addEventListener('click', close)
  document.addEventListener('keydown', event =>
    event.key === 'Escape' && modal.style.display === 'flex' ? close() : null
  )
}

//
// handle auth
//
const handleAuth = (booksData, authorsData) => {
  const button = document.querySelector('.login')
  const close = document.querySelector('.modal .close')
  const modal = document.querySelector('.modal')
  const input = document.querySelector('.modal input')
  if (!button || !input) return

  const auth = async () => {
    const login = input.value
    if (!login) return

    const users = await getData('Users')

    if (users.some(user => user.fields.Login === btoa(encodeURIComponent(login)))) {
      const user = users.find(user => user.fields.Login === btoa(encodeURIComponent(login)))
      console.log(`Hello, ${user.fields.Name}!`)
      sessionStorage.setItem('userName', user.fields.Name)
      sessionStorage.setItem('userId', user.id)
      sessionStorage.setItem('userBookmarks', user.fields.Bookmarks)
      input.value = ''
      close.click()
      createBooksElements(booksData, authorsData)
      handleBookSelect()
      handleLike()
    } else {
      console.log('Hello, stranger!')
      close.click()
    }
  }

  button.addEventListener('click', auth)
}

//
// handle like
//
const handleLike = () => {
  const inputs = document.querySelectorAll('.card input')
  const userId = sessionStorage.userId

  if (!inputs) return

  inputs.forEach(input => {
    input.addEventListener('change', async () => {
      let users
      let user
      if (userId) {
        users = await getData('Users')
        user = users.find(user => user.id === userId)
      }
      const bookId = input.dataset.bookId

      if (input.checked) {
        const bookmarks = sessionStorage.userBookmarks ? [...sessionStorage.userBookmarks.split(','), bookId] : [bookId]
        if (userId) {
          updateItem('Users', { itemId: userId, bookmarks })
        }
        sessionStorage.setItem('userBookmarks', bookmarks)
      } else {
        const bookmarks = sessionStorage.userBookmarks.split(',').filter(bId => bId !== bookId)
        if (userId) {
          updateItem('Users', { itemId: userId, bookmarks })
        }
        sessionStorage.setItem('userBookmarks', bookmarks)
      }
    })
  })
}

//
// async start main page
//
const startMainPage = async () => {
  if (!document.querySelector('.main-page')) return
  const booksData = await getData('Books')
  booksData.sort((b, a) => a.createdTime.localeCompare(b.createdTime))
  const authorsData = await getData('Authors')
  createBooksElements(booksData, authorsData)
  document.querySelector('.main-page').style.opacity = 1
  document.querySelector('.main-page .search').style.display = 'flex'
  handleBookSelect()
  modalOpen()
  modalClose()
  handleAuth(booksData, authorsData)
}

window.addEventListener('DOMContentLoaded', () => {
  startMainPage()
})
