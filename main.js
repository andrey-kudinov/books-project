import { getBooks, getAuthors, addBook } from './scripts/airtable'
import './styles/reset.css'
import './styles/style.scss'
import './scripts/burger'
import './scripts/navigation'

const books = document.querySelector('.books')

//
// create books list
//
const createBooksHtml = async () => {
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
        <div
          class="book"
          data-author='${author.fields.Name}'
          data-title='${book.fields.Name}'
          data-description='${book.fields.Synopsis}'
          data-image=${
            book.fields['Cover Photo']
              ? book.fields['Cover Photo'][0].thumbnails.large.url
              : ''
          }
        >
          <img src=${
            book.fields['Cover Photo']
              ? book.fields['Cover Photo'][0].thumbnails.large.url
              : ''
          } alt='${book.fields.Name}' />
        </div>
      `
    })
    .join()
}

//
// handle book select
//
const handleBookSelect = () => {
  const books = document.querySelectorAll('.book')
  const cards = document.querySelectorAll('.card')

  if (!books || !cards) return

  books.forEach(book => {
    book.addEventListener('click', () => {
      cards[1].innerHTML = cards[0].innerHTML
      const { image, title, description, author } = book.dataset

      cards[0].innerHTML = `
        <div class="card__image">
          <img src=${image} alt="" />
        </div>

        <div class="card__empty"></div>

        <div class="card__info">
          <h3>${title}</h3>
          <p class="card__desc">
            ${description}
          </p>
          <p class="card__genre">${author}</p>
          <button>Now Read!</button>
        </div>
      `

      cards.forEach(card => card.classList.remove('card_green', 'card_pink'))
      cards[0].classList.add('card_green')
      cards[1].classList.add('card_pink')
    })
  })
}

//
// async start project
//
const startProject = async () => {
  await createBooksHtml()
  handleBookSelect()
}

startProject()
