const base = `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_APP}`

export const getData = async (table) => {
  const response = await fetch(
    `${base}/${table}?api_key=${
      import.meta.env.VITE_AIRTABLE_KEY
    }`
  )

  return (await response.json()).records
}

export const getItem = async (table, bookId) => {
  const response = await fetch(
    `${base}/${table}/${bookId}?api_key=${
      import.meta.env.VITE_AIRTABLE_KEY
    }`
  )

  return await response.json()
}

export const addItem = async (table, fields) => {
  const airtableResult = await fetch(
    `${base}/${table}?api_key=${
      import.meta.env.VITE_AIRTABLE_KEY
    }`,
    {
      method: 'POST',
      body: JSON.stringify({ records: [{ fields }] }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  const response = await airtableResult.json()
  console.log('addItem -', response)
  return response
}

export const updateItem = async (table , { itemId, coverUrl, title, synopsis, authorId, shown, name, role, about, avaUrl }) => {
  const fields = {}
  if (title) fields.Title = title
  if (coverUrl) fields['Cover Photo'] = [{ url: coverUrl }]
  if (synopsis) fields.Synopsis = synopsis
  if (authorId) fields.Author = authorId
  if (name) fields.Name = name
  if (avaUrl) fields.Avatar = [{ url: avaUrl }]
  if (role) fields.Role = role
  if (about) fields.About = about
  if (shown !== undefined) fields.Shown = shown

  const airtableResult = await fetch(
    `${base}/${table}/${itemId}?api_key=${
      import.meta.env.VITE_AIRTABLE_KEY
    }`,
    {
      method: 'PATCH',
      body: JSON.stringify({ fields }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  console.log('updateItem -', await airtableResult.json())
}
