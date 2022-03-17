export const removeLinks = selectors => {
  if (!selectors || !selectors.length) return

  selectors.forEach(selector => {
    document.querySelector(selector).remove()
  })
}

export const showOrHideLinks = ({ action, selectors }) => {
  if (!selectors || !selectors.length) return

  selectors.forEach(selector => {
    document.querySelector(selector).style.display = action === 'hide' ? 'none' : 'block'
  })
}

export const setHeader = () => {
  if (sessionStorage.isAdmin === 'true') return

  showOrHideLinks({ action: 'hide', selectors: ['.books-link', '.users-link'] })
}
