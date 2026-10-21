export type ValidationErrorKey =
  | 'required'
  | 'contains_numbers'
  | 'invalid_length'
  | 'invalid_format'
  | 'invalid_protocol'

export function validateName(value: string): ValidationErrorKey | null {
  const trimmed = value.trim()
  if (!trimmed) return 'required'
  if (/\p{Decimal_Number}/u.test(trimmed)) return 'contains_numbers'
  if ([...trimmed].length < 2) return 'invalid_length'
  return null
}

export function validateEmail(value: string, typeMismatch: boolean): ValidationErrorKey | null {
  if (!value.trim()) return 'required'
  if (typeMismatch) return 'invalid_format'
  return null
}

export function validateWebsiteUrl(value: string): ValidationErrorKey | null {
  const trimmed = value.trim()
  if (!trimmed) return 'required'
  try {
    const url = new URL(trimmed)
    if (!['http:', 'https:'].includes(url.protocol)) return 'invalid_protocol'
    return null
  } catch {
    return 'invalid_format'
  }
}

export function validateRequiredSelection(value: string): ValidationErrorKey | null {
  return value ? null : 'required'
}
