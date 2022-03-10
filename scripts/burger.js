
const navToggle = document.querySelector('.nav__toggle')
const navWrapper = document.querySelector('.nav__wrapper')

navToggle.addEventListener('click', function () {
  if (navWrapper.classList.contains('active')) {
    navToggle.setAttribute('aria-expanded', 'false')
    navToggle.setAttribute('aria-label', 'menu')
    navWrapper.classList.remove('active')
  } else {
    navWrapper.classList.add('active')
    navToggle.setAttribute('aria-label', 'close menu')
    navToggle.setAttribute('aria-expanded', 'true')
  }
})
