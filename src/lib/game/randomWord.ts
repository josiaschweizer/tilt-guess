const API_URL = 'https://random-words-api.kushcreates.com/api'

export async function fetchRandomGermanWord(): Promise<string | null> {
  try {
    const url = new URL(API_URL)
    url.searchParams.set('language', 'de')
    url.searchParams.set('type', 'capitalized')
    url.searchParams.set('words', '1')

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json; charset=utf-8',
        'Accept-Charset': 'utf-8',
      },
    })

    if (!response.ok) {
      console.error(`[ERROR] HTTP ${response.status} ${response.statusText}`)
      return null
    }

    const data: { word: string }[] = await response.json()
    const word = data[0]?.word

    return word ? word.normalize('NFC').trim() : null
  } catch (error) {
    console.error('[ERROR] Error getting random german word:', error)
    return null
  }
}
