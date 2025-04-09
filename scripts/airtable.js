const base = `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_APP}`

export const getData = async table => {
  const response = await fetch(`${base}/${table}`, {
    headers: {
      "Authorization": `Bearer ${import.meta.env.VITE_AIRTABLE_KEY}`
    }
  });
  const data = await response.json()
  console.log('getData -', table, data.records)

  return data.records
}

export const getItem = async (table, itemId) => {
  const response = await fetch(`${base}/${table}/${itemId}`, {
    headers: {
      "Authorization": `Bearer ${import.meta.env.VITE_AIRTABLE_KEY}`
    }
  });
  const dataItem = await response.json();
  console.log('getItem -', table, itemId, dataItem);

  return dataItem;
}

export const addItem = async (table, fields) => {
  const airtableResult = await fetch(`${base}/${table}`, {
    method: 'POST',
    body: JSON.stringify({ records: [{ fields }] }),
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${import.meta.env.VITE_AIRTABLE_KEY}`
    }
  })

  const response = await airtableResult.json()
  console.log('addItem -', table, response)

  return response
}

export const updateItem = async (
  table,
  { itemId, coverUrl, title, synopsis, authorId, shown, name, password, role, about, avaUrl, bookmarks }
) => {
  const fields = {}
  if (title) fields.Title = title
  if (coverUrl) fields['Cover Photo'] = [{ url: coverUrl }]
  if (synopsis) fields.Synopsis = synopsis
  if (authorId) fields.Author = authorId
  if (name) fields.Name = name
  if (password) fields.Password = password
  if (avaUrl) fields.Avatar = [{ url: avaUrl }]
  if (role) fields.Role = role
  if (about) fields.About = about
  if (shown !== undefined) fields.Shown = shown
  if (bookmarks) fields.Bookmarks = bookmarks

  const airtableResult = await fetch(`${base}/${table}/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields }),
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${import.meta.env.VITE_AIRTABLE_KEY}`
    }
  })

  const response = await airtableResult.json()
  console.log('updateItem -', table, response)

  return response
}
