'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function useQueryParam(
  key: string,
  defaultValue: string | null = null
): [string | null, (newValue: string | null) => void] {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const value = searchParams.get(key) ?? defaultValue

  const setValue = (newValue: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (newValue == null) params.delete(key)
    else params.set(key, newValue)

    router.replace(`${pathname}?${params.toString()}`)
  }

  return [value, setValue]
}