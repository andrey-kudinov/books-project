const navItems = document.querySelectorAll('.nav__item')

navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(item => {
      item.classList.remove('active')
    })
    item.classList.add('active')
    document.querySelector('.nav__wrapper').classList.remove('active')
  })
})