import { getData, addItem, updateItem } from '../../scripts/airtable'
import { handleUploadImage, addUploadWidgetScript } from '../../scripts/cloudinary'

import './users.scss'

//
// Add new user
//
const handleAddUser = async () => {
  const button = document.querySelector('.add-user__add')
  if (!button) return

  button.addEventListener('click', async () => {
    const input = document.querySelector('.add-user__name')
    const name = input.value
    const textarea = document.querySelector('.add-user__about')
    const about = textarea.value
    const select = document.querySelector('.add-user__role')
    const role = select.value
    const roleTitle = select.options[select.selectedIndex].text
    const avaUrl = document.querySelector('.add-user__upload-image').dataset.url

    if (!avaUrl || !name || !about || !role) return

    const fields = {
      Avatar: [{ url: avaUrl }],
      Name: name,
      Login: btoa(encodeURIComponent(name)),
      About: about,
      Admin: role === 'admin',
      Shown: true
    }

    const newUser = await addItem('Users', fields)

    const users = document.querySelector('.users-page .users')
    const user = document.createElement('div')
    user.classList.add('user')
    user.innerHTML = `
      <div class="user__img"><img src=${avaUrl} alt='${name}'/></div>
      <span class="user__name clm2">${name}</span>
      <div class="user__about clm3"><p>${about}</p></div>
      <span class="user__role clm4">${roleTitle}</span>
      <button class="users-page__button user__remove btn" data-id="${newUser.records[0].id}">Remove user</button>
    `
    users.prepend(user)

    input.value = ''
    textarea.value = ''
    const addImageButton = document.querySelector('.add-user__upload-image')
    addImageButton.textContent = 'Add cover'
    addImageButton.disabled = false
  })
}

//
// create users list
//
const createUsersElements = (usersData) => {
  const users = document.querySelector('.users-page .users')
  if (!users) return

  console.log(usersData)

  users.innerHTML = usersData
    .filter(user => user.fields.Shown)
    .map(user => {
      return `
        <div class="user">
          <div class="user__img">
            <img
              src=${user.fields.Avatar ? user.fields.Avatar[0].thumbnails.large.url : ''}
              alt='${user.fields.Name}' 
            />
          </div>
          <span class="user__name clm2">${user.fields.Name}</span>
          <div class="user__about clm3"><p>${user.fields.About}</p></div>
          <span class="user__role clm4">${user.fields.Admin ? 'Admin' : 'Regular User'}</span>
          <button class="users-page__button user__remove btn" data-id="${user.id}">Remove user</button>
        </div>
      `
    })
    .join('')
}

//
// remove user
//
const removeUser = () => {
  const buttons = document.querySelectorAll('.user__remove')
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const parent = button.closest('.user')
      Array.from(parent.children).forEach(child => (child.style.transform = 'scale(0)'))
      setTimeout(() => {
        button.closest('.user').remove()
      }, 300)
      updateItem('Users', {itemId: button.dataset.id, shown: false})
    })
  })
}

//
// async start users page
//
const startUsersPage = async () => {
  if (!document.querySelector('.users-page')) return
  addUploadWidgetScript()
  const usersData = await getData('Users')
  usersData.sort((b, a) => a.createdTime.localeCompare(b.createdTime))
  createUsersElements(usersData)
  handleUploadImage('.add-user__upload-image')
  document.querySelector('.users-page').style.opacity = 1
  await handleAddUser()
  removeUser()
}

window.addEventListener('DOMContentLoaded', () => {
  startUsersPage()
})
