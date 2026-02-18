const API_URL = 'https://random-words-api.kushcreates.com/api'

function decodeUtf8(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder('utf-8')
  return decoder.decode(buffer)
}

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

    const buffer = await response.arrayBuffer()
    const text = decodeUtf8(buffer)
    const data: { word: string }[] = JSON.parse(text)

    const word = data[0]?.word
    return word ? word.normalize('NFC') : null
  } catch (error) {
    console.error('[ERROR] Error getting random german word:', error)
    return null
  }
}
