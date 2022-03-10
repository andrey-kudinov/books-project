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
