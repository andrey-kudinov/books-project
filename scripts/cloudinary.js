export const handleUploadImage = (selector) => {
  const button = document.querySelector(selector)
  const myWidget = cloudinary.createUploadWidget(
    {
      cloudName: import.meta.env.VITE_CLOUD_NAME,
      uploadPreset: import.meta.env.VITE_PRESET
    },
    (error, result) => {
      if (!error && result && result.event === 'success') {
        console.log('Done! Here is the image info: ', result.info)
        button.dataset.url = result.info.url
        button.textContent = '✔'
        button.disabled = true
      }
    }
  )

  button.addEventListener(
    'click',
    () => {
      myWidget.open()
    },
    false
    )
}
