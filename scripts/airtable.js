export const getBooks = async () => {
  const response = await fetch(
    `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_APP}/Books?api_key=${
      import.meta.env.VITE_AIRTABLE_KEY
    }`
  )

  return (await response.json()).records
}

export const getBook = async bookId => {
  const response = await fetch(
    `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_APP}/Books/${bookId}?api_key=${
      import.meta.env.VITE_AIRTABLE_KEY
    }`
  )

  return await response.json()
}

export const getAuthors = async () => {
  const response = await fetch(
    `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_APP}/Authors?api_key=${
      import.meta.env.VITE_AIRTABLE_KEY
    }`
  )

  return (await response.json()).records
}

export const addBook = async ({ url, title, synopsis, authorId }) => {
  const fields = {
    'Cover Photo': [{ url }],
    Author: [authorId],
    Synopsis: synopsis,
    Name: title,
    Shown: true
  }

  const airtableResult = await fetch(
    `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_APP}/Books?api_key=${
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
  console.log('addBook -', response)
  return response
}

export const updateBook = async ({ bookId, url, title, synopsis, authorId, shown }) => {
  const fields = {}
  if (title) fields.Title = title
  if (url) fields['Cover Photo'] = [{ url }]
  if (synopsis) fields.Synopsis = synopsis
  if (authorId) fields.Author = authorId
  if (shown !== undefined) fields.Shown = shown

  const airtableResult = await fetch(
    `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_APP}/Books/${bookId}?api_key=${
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

  console.log('updateBook -', await airtableResult.json())
}
