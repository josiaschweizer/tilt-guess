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
      const errorText = await response.text()
      console.error(
        `[ERROR] HTTP ${response.status} ${response.statusText}: ${errorText}`,
      )
      return null
    }

    const data: { word: string }[] = await response.json()
    let word = data[0]?.word
    if (!word) {
      return null
    }

    word = word.replace(/^\uFEFF/, '')
    return word.normalize('NFC')
  } catch (error) {
    console.error('[ERROR] Error getting random german word:', error)
    return null
  }
}
