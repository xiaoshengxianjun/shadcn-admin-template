import { useEffect, useState } from 'react'

import { LAYOUT_MODE_STORAGE_KEY, type LayoutMode } from '@/types/layout'

const FALLBACK_LAYOUT_MODE: LayoutMode = 'mixed'

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

  return {
    layoutMode,
    setLayoutMode: setLayoutModeState,
  }
}
