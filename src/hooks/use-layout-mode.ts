import { useEffect, useState, type SetStateAction } from 'react'

import { LAYOUT_MODE_STORAGE_KEY, type LayoutMode } from '@/types/layout'

const FALLBACK_LAYOUT_MODE: LayoutMode = 'mixed'
const LAYOUT_MODE_CHANGE_EVENT = 'layout-mode-change'

function isValidLayoutMode(value: string | null): value is LayoutMode {
  return value === 'leftSidebar' || value === 'topNav' || value === 'mixed'
}

export function useLayoutMode() {
  const [layoutMode, setLayoutModeState] = useState<LayoutMode>(() => {
    if (typeof window === 'undefined') {
      return FALLBACK_LAYOUT_MODE
    }
    const savedLayoutMode = window.localStorage.getItem(LAYOUT_MODE_STORAGE_KEY)
    return isValidLayoutMode(savedLayoutMode) ? savedLayoutMode : FALLBACK_LAYOUT_MODE
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    window.localStorage.setItem(LAYOUT_MODE_STORAGE_KEY, layoutMode)
  }, [layoutMode])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const syncFromStorage = () => {
      const savedLayoutMode = window.localStorage.getItem(LAYOUT_MODE_STORAGE_KEY)
      if (isValidLayoutMode(savedLayoutMode)) {
        setLayoutModeState(savedLayoutMode)
      }
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key !== LAYOUT_MODE_STORAGE_KEY) {
        return
      }
      syncFromStorage()
    }

    window.addEventListener('storage', onStorage)
    window.addEventListener(LAYOUT_MODE_CHANGE_EVENT, syncFromStorage)

    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(LAYOUT_MODE_CHANGE_EVENT, syncFromStorage)
    }
  }, [])

  const setLayoutMode = (nextValue: SetStateAction<LayoutMode>) => {
    setLayoutModeState((prev) => {
      const resolvedValue = typeof nextValue === 'function' ? nextValue(prev) : nextValue
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LAYOUT_MODE_STORAGE_KEY, resolvedValue)
        window.dispatchEvent(new Event(LAYOUT_MODE_CHANGE_EVENT))
      }
      return resolvedValue
    })
  }

  return {
    layoutMode,
    setLayoutMode,
  }
}
