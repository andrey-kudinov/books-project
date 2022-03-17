export const removeLinks = selectors => {
  if (!selectors || !selectors.length) return

  selectors.forEach(selector => {
    const element = document.querySelector(selector)
    if (!element) return
    element.remove()
  })
}

export const showOrHideLinks = ({ action, selectors }) => {
  if (!selectors || !selectors.length) return

  selectors.forEach(selector => {
    const element = document.querySelector(selector)
    if (!element) return
    element.style.display = action === 'hide' ? 'none' : 'block'
  })
}

export const setHeader = () => {
  if (sessionStorage.isAdmin === 'true') return

  showOrHideLinks({ action: 'hide', selectors: ['.books-link', '.users-link', '.profile-link'] })
}
