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

const button = document.querySelector('.add-book__upload-image')
button.addEventListener(
  'click',
  () => {
    myWidget.open()
  },
  false
)
