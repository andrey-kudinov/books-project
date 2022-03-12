export const handleUploadImage = (selector) => {
  const myWidget = cloudinary.createUploadWidget(
    {
      cloudName: import.meta.env.VITE_CLOUD_NAME,
      uploadPreset: import.meta.env.VITE_PRESET
    },
    (error, result) => {
      if (!error && result && result.event === 'success') {
        console.log('Done! Here is the image info: ', result.info)
      }
    }
  )

  const button = document.querySelector(selector)
  button.addEventListener(
    'click',
    () => {
      myWidget.open()
    },
    false
    )
}
