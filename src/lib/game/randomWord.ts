const API_URL = 'https://random-words-api.kushcreates.com/api'

export async function fetchRandomGermanWord(): Promise<string | null> {
  try {
    const url = new URL(API_URL)
    url.searchParams.set('language', 'de')
    url.searchParams.set('type', 'capitalized')
    url.searchParams.set('words', '1')

    const response = await fetch(url)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `[ERROR] HTTP ${response.status} ${response.statusText}: ${errorText}`,
      )
    }

    const data: { word: string }[] = await response.json()
    return data[0]?.word ?? null
  } catch (error) {
    console.error('[ERROR] Error getting random german word:', error)
    return null
  }
}
