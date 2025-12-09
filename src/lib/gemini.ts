import { GeminiResponse, ParsedExpense, Category } from './types'

const GEMINI_API_KEY = 'AIzaSyDCY7f-Iaswz3FMidS565AHwotyvnXrSX4'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent'

export class APISystemError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'APISystemError'
  }
}

export class InvalidPromptError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidPromptError'
  }
}

export function validatePrompt(text: string): { valid: boolean; error?: string } {
  const trimmed = text.trim()
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Prompt không được để trống' }
  }
  
  if (trimmed.length < 3) {
    return { valid: false, error: 'Prompt quá ngắn, vui lòng mô tả chi tiết hơn' }
  }
  
  if (trimmed.length > 500) {
    return { valid: false, error: 'Prompt quá dài, vui lòng rút ngắn lại' }
  }
  
  return { valid: true }
}

export async function parseExpenseText(
  text: string, 
  categories: Category[] = [],
  retryCount = 0
): Promise<ParsedExpense> {
  const maxRetries = 2

  const categoriesInfo = categories.length > 0 
    ? `\n\nAvailable categories:\n${categories.map(c => `- ID: "${c.id}", Name: "${c.name}", Description: "${c.description}"`).join('\n')}\n\nIf the expense matches one of the categories above, include "categoryId" with the category's ID. If no category matches, set "categoryId" to null.`
    : '\n\nNo categories available, set "categoryId" to null.'

  const prompt = `Parse this Vietnamese/English expense entry into JSON format. Extract:
- spend: amount spent in thousands VND (number without zeros, null if not spending)
- earn: amount earned in thousands VND (number without zeros, null if not earning)
- content: description of what was bought/earned (string)
- categoryId: the ID of the matching category if applicable, or null${categoriesInfo}

Rules:
- If text contains "nhận", "thu", "earn", "kiếm", it's earning (set earn, spend=null)
- Otherwise it's spending (set spend, earn=null)
- Amount is in thousands (35 means 35,000 VND)
- Match category based on description if available
- Return ONLY valid JSON, no markdown formatting

Example input: "bánh tráng trộn 35"
Example output: {"spend": 35, "earn": null, "content": "bánh tráng trộn", "categoryId": null}

Example input: "nhận lương tháng 15000"
Example output: {"spend": null, "earn": 15000, "content": "nhận lương tháng", "categoryId": null}

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
      if (response.status >= 500) {
        throw new APISystemError('Hệ thống API đang gặp sự cố, vui lòng thử lại sau')
      }
      if (response.status === 429) {
        throw new APISystemError('Quá nhiều yêu cầu, vui lòng thử lại sau')
      }
      throw new APISystemError(`Lỗi kết nối API (${response.status})`)
    }

    const data: GeminiResponse = await response.json()
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!textResponse) {
      throw new APISystemError('API không trả về kết quả')
    }

    const jsonMatch = textResponse.match(/\{[\s\S]*\}/)
    const jsonStr = jsonMatch ? jsonMatch[0] : textResponse

    let parsed: ParsedExpense
    try {
      parsed = JSON.parse(jsonStr)
    } catch {
      throw new InvalidPromptError('Không thể phân tích prompt, vui lòng mô tả rõ hơn (VD: "mua cơm 35" hoặc "nhận lương 5000")')
    }

    if (!parsed.content || typeof parsed.content !== 'string' || parsed.content.trim().length === 0) {
      throw new InvalidPromptError('Không tìm thấy mô tả giao dịch, vui lòng nhập lại')
    }

    if (parsed.spend === null && parsed.earn === null) {
      throw new InvalidPromptError('Không tìm thấy số tiền, vui lòng thêm số tiền vào prompt')
    }

    if ((parsed.spend !== null && (typeof parsed.spend !== 'number' || parsed.spend < 0)) ||
        (parsed.earn !== null && (typeof parsed.earn !== 'number' || parsed.earn < 0))) {
      throw new InvalidPromptError('Số tiền không hợp lệ, vui lòng kiểm tra lại')
    }

    return parsed
  } catch (error) {
    if (error instanceof APISystemError || error instanceof InvalidPromptError) {
      throw error
    }

    if (retryCount < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)))
      return parseExpenseText(text, categories, retryCount + 1)
    }

    if (error instanceof Error) {
      if (error.message.includes('fetch') || error.message.includes('network')) {
        throw new APISystemError('Lỗi kết nối mạng, vui lòng kiểm tra internet và thử lại')
      }
    }

    throw new APISystemError('Hệ thống tạm thời gặp lỗi, vui lòng thử lại sau')
  }
}

export async function parseExpenseWithAI(
  text: string,
  userName: string,
  categories: Category[] = []
): Promise<{ success: boolean; data?: ParsedExpense; error?: 'system' | 'invalid' }> {
  const validation = validatePrompt(text)
  if (!validation.valid) {
    return { success: false, error: 'invalid' }
  }

  try {
    const parsed = await parseExpenseText(text, categories)
    return { success: true, data: parsed }
  } catch (error) {
    if (error instanceof APISystemError) {
      return { success: false, error: 'system' }
    }
    if (error instanceof InvalidPromptError) {
      return { success: false, error: 'invalid' }
    }
    return { success: false, error: 'system' }
  }
}
