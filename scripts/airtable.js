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

export const addBook = async () => {
  const body = {
    records: [
      {
        fields: {
          'Cover Photo': [
            {
              url: 'http://res.cloudinary.com/dkqwi0tah/image/upload/v1646918126/logoAI_ca4jbh.png'
            }
          ],
          Author: ['recnNnKZPQwDmwOXv'],
          Synopsis:
            'Pride and Prejudice is an 1813 romantic novel of manners written by Jane Austen. The novel follows the character development of Elizabeth Bennet, the dynamic protagonist of the book, who learns about the repercussions of hasty judgments and eventually comes to appreciate the difference between superficial goodness and actual goodness. A classic piece filled with comedy, its humor lies in its honest depiction of manners, education, marriage and money during the Regency era in Great Britain.\n\nMr. Bennet of Longbourn estate has five daughters, but because his property is entailed it can only be passed from male heir to male heir. Consequently, Mr. Bennet\'s family will be destitute upon his death. Because his wife also lacks an inheritance, it is imperative that at least one of the girls marry well to support the others upon his death, which is a motivation that drives the plot. Jane Austen\'s opening line--"It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife"-- is a sentence filled with irony and sets the tone for the book. The novel revolves around the importance of marrying for love, not simply for economic gain or social prestige, despite the communal pressure to make a good (i.e., wealthy) match.',
          Name: 'Test test test'
        }
      }
    ]
  }

  const airtableResult = await fetch(
    `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_APP}/Books?api_key=${
      import.meta.env.VITE_AIRTABLE_KEY
    }`,
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  console.log(await airtableResult.json())
}
