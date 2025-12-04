import { GeminiResponse, ParsedExpense } from './types'

const GEMINI_API_KEY = 'AIzaSyDCY7f-Iaswz3FMidS565AHwotyvnXrSX4'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

export async function parseExpenseText(text: string, retryCount = 0): Promise<ParsedExpense> {
  const maxRetries = 3

  const prompt = `Parse this Vietnamese/English expense entry into JSON format. Extract:
- user: person's name (string)
- spend: amount spent in thousands VND (number without zeros, null if not spending)
- earn: amount earned in thousands VND (number without zeros, null if not earning)
- content: description of what was bought/earned (string)

Rules:
- If text contains "nhận", "thu", "earn", "kiếm", it's earning (set earn, spend=null)
- Otherwise it's spending (set spend, earn=null)
- Amount is in thousands (35 means 35,000 VND)
- Return ONLY valid JSON, no markdown formatting

Example input: "Minh Quân bánh tráng trộn 35"
Example output: {"user": "Minh Quân", "spend": 35, "earn": null, "content": "bánh tráng trộn"}

Now parse this: "${text}"

Return ONLY the JSON object, no other text.`

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data: GeminiResponse = await response.json()
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!textResponse) {
      throw new Error('No text response from API')
    }

    const jsonMatch = textResponse.match(/\{[\s\S]*\}/)
    const jsonStr = jsonMatch ? jsonMatch[0] : textResponse

    const parsed: ParsedExpense = JSON.parse(jsonStr)

    if (!parsed.user || !parsed.content || (parsed.spend === null && parsed.earn === null)) {
      throw new Error('Invalid parsed data structure')
    }

    return parsed
  } catch (error) {
    if (retryCount < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 500 * (retryCount + 1)))
      return parseExpenseText(text, retryCount + 1)
    }
    throw new Error(`Failed to parse after ${maxRetries} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
