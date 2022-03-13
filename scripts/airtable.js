export const getBooks = async () => {
  const response = await fetch(
    `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_APP}/Books?api_key=${
      import.meta.env.VITE_AIRTABLE_KEY
    }`
  )

  return (await response.json()).records
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
    Name: title
  }

  const airtableResult = await fetch(
    `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_APP}/Books?api_key=${
      import.meta.env.VITE_AIRTABLE_KEY
    }`,
    {
      method: 'POST',
      body: JSON.stringify({records: [{fields}]}),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  console.log(await airtableResult.json())
}
