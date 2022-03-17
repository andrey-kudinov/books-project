import { getData, updateItem, addItem } from './scripts/airtable'
import { showOrHideLinks, setHeader } from './scripts/header'
import { handleUploadImage, addUploadWidgetScript } from './scripts/cloudinary'

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
const modalOpen = ({ trigger, modal }) => {
  const button = document.querySelector(trigger)
  if (!button) return

  const overlay = document.querySelector('.overlay')
  const popup = document.querySelector(modal)
  const input = popup.querySelector('input')

  button.addEventListener('click', () => {
    overlay.style.display = 'grid'
    popup.style.display = 'flex'
    input.focus()

    if (modal === '.modal-profile') {
      input.placeholder = sessionStorage.userName
    }
  })
}

//
// close modal
//
const modalClose = ({ modal }) => {
  const popup = document.querySelector(modal)
  if (!popup) return

  const button = popup.querySelector('.close')
  const overlay = document.querySelector('.overlay')

  const close = e => {
    overlay.style.display = 'none'
    popup.style.display = 'none'
    const uploadImageButton = document.querySelector('.upload-image')
    uploadImageButton.textContent = 'Change avatar'
    uploadImageButton.dataset.url = ''
    uploadImageButton.disabled = false
  }

  button.addEventListener('click', close)
  document.addEventListener('keydown', event =>
    event.key === 'Escape' && popup.style.display === 'flex' ? close() : null
  )
}

//
// handle session storage
//
const setSessionStorage = user => {
  if (!user) return
  sessionStorage.clear()
  sessionStorage.setItem('userName', user.fields?.Name)
  sessionStorage.setItem('userId', user.id)
  sessionStorage.setItem('isAdmin', user.fields?.Admin)
  sessionStorage.setItem('userAvatar', user.fields['Avatar'][0].thumbnails?.large.url || user.fields['Avatar'][0].url)
  if (user.fields?.Bookmarks) {
    sessionStorage.setItem('userBookmarks', user.fields?.Bookmarks)
  }
}

//
// handle save
//
const handleSave = () => {
  const button = document.querySelector('.modal-profile .save')
  const input = document.querySelector('.modal-profile input')
  const avatar = document.querySelector('.upload-image')
  
  if (!button) return
  
  button.addEventListener('click', async () => {
    const userId = sessionStorage.userId
    const avaUrl = avatar.dataset.url
    const name = input.value
    if (!name || !userId) return

    let updatedUser
    if (avaUrl) {
      updatedUser = await updateItem('Users', { itemId: userId, name, avaUrl })
    } else {
      updatedUser = await updateItem('Users', { itemId: userId, name })
    }

    if (updatedUser) {
      setSessionStorage(updatedUser)
      sessionStorage.setItem('userAvatar', updatedUser.fields['Avatar'][0].url || updatedUser.fields['Avatar'][0].thumbnails?.large.url)
      input.placeholder = name
    }
    input.value = ''
    const close = document.querySelector('.modal-profile .close')
    close.click()
    setAvatar()
  })
}

//
// handle logout
//
const handleLogout = (booksData, authorsData) => {
  const button = document.querySelector('.modal-profile .logout')
  if (!button) return
  button.addEventListener('click', () => {
    sessionStorage.clear()
    createBooksElements(booksData, authorsData)
    handleBookSelect()
    handleLike()
    showOrHideLinks({ action: 'hide', selectors: ['.profile-link'] })
    showOrHideLinks({ action: 'show', selectors: ['.auth-link'] })
    const input = document.querySelector('.modal-auth input')
    input.placeholder = 'Login'
    const avatarWrapper = document.querySelector('.nav__profile .avatar-wrapper')
    const placeholder = document.querySelector('.nav__profile .placeholder')
    avatarWrapper.style.display = 'none'
    placeholder.style.display = 'block'
    const close = document.querySelector('.modal-profile .close')
    close.click()
  })
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
      setSessionStorage(user)

      if (user.fields.Admin) {
        showOrHideLinks({ action: 'show', selectors: ['.books-link', '.users-link'] })
      }
    } else {
      const url = 'https://res.cloudinary.com/dkqwi0tah/image/upload/v1647533839/photo_2022-03-17_20.16.41_ctnqex.jpg'
      const fields = {
        Avatar: [{ url }],
        Name: login,
        Login: btoa(encodeURIComponent(login)),
        About: 'self-registered',
        Admin: false,
        Shown: true
      }

      const newUser = await addItem('Users', fields)
      console.log('newUser -', newUser.records[0])
      setSessionStorage(newUser.records[0])

      console.log(`Hello, ${login}!`)
    }

    if (sessionStorage.userId) {
      showOrHideLinks({ action: 'show', selectors: ['.profile-link'] })
      showOrHideLinks({ action: 'hide', selectors: ['.auth-link'] })

      setAvatar()
    }

    input.value = ''
    close.click()
    createBooksElements(booksData, authorsData)
    handleBookSelect()
    handleLike()
  }

  button.addEventListener('click', auth)
}

//
// set avatar
//
const setAvatar = () => {
  const avatar = document.querySelector('.nav__profile .avatar')
  const avatarWrapper = document.querySelector('.nav__profile .avatar-wrapper')
  const placeholder = document.querySelector('.nav__profile .placeholder')
  avatar.src = sessionStorage.userAvatar
  avatarWrapper.style.display = 'block'
  placeholder.style.display = 'none'
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
        const bookmarks =
          sessionStorage.userBookmarks && !sessionStorage.userBookmarks.includes('undefined')
            ? [...sessionStorage.userBookmarks.split(','), bookId]
            : [bookId]
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
  addUploadWidgetScript()
  setHeader()
  if (sessionStorage.userId) {
    showOrHideLinks({ action: 'show', selectors: ['.profile-link'] })
    showOrHideLinks({ action: 'hide', selectors: ['.auth-link'] })
    setAvatar()
  }
  const booksData = await getData('Books')
  booksData.sort((b, a) => a.createdTime.localeCompare(b.createdTime))
  const authorsData = await getData('Authors')
  createBooksElements(booksData, authorsData)

  document.querySelector('.main-page').style.opacity = 1
  document.querySelector('.main-page .search').style.display = 'flex'

  handleBookSelect()
  modalOpen({ trigger: '.nav__auth', modal: '.modal-auth' })
  modalOpen({ trigger: '.nav__profile', modal: '.modal-profile' })
  modalClose({ modal: '.modal-profile' })
  modalClose({ modal: '.modal-auth' })
  handleAuth(booksData, authorsData)
  handleLogout(booksData, authorsData)
  handleSave()
}

window.addEventListener('DOMContentLoaded', () => {
  startMainPage()
})

window.onload = () => {
  handleUploadImage('.upload-image')
}
