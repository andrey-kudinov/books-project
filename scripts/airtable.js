const base = `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_APP}`

export const getData = async table => {
  try {
    const response = await fetch(`${base}/${table}?api_key=${import.meta.env.VITE_AIRTABLE_KEY}`);

    if (!response.ok) {
      throw new Error ('API returned ${response.status}');
    }

    const data = await response.json()
    console.log('getData -', table, data.records)

    return data.records;
  } catch (error) {
    console.error('Failed to fetch', error);

    const fallbackContainer = document.querySelector('.main-page');
    if(fallbackContainer) {
      fallbackContainer.style.opacity = 1;
      fallbackContainer.innerHTML = `
        <div class="error-message">
          <div class="error-glow-box">
            <p><span style="font-size: 50px; font-weight: bold;">Whoops!</span> <br /> <br/> The library is empty today. <br /> <br />Come back later!</p>
          </div>
        </div
      `;
    }
  }
}

export const getItem = async (table, itemId) => {
  const response = await fetch(`${base}/${table}/${itemId}?api_key=${import.meta.env.VITE_AIRTABLE_KEY}`)
  const dataItem = await response.json()
  console.log('getItem -', table, itemId, dataItem)

  return dataItem
}

export const addItem = async (table, fields) => {
  const airtableResult = await fetch(`${base}/${table}?api_key=${import.meta.env.VITE_AIRTABLE_KEY}`, {
    method: 'POST',
    body: JSON.stringify({ records: [{ fields }] }),
    headers: {
      'Content-Type': 'application/json'
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

  const airtableResult = await fetch(`${base}/${table}/${itemId}?api_key=${import.meta.env.VITE_AIRTABLE_KEY}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const response = await airtableResult.json()
  console.log('updateItem -', table, response)

  return response
}
