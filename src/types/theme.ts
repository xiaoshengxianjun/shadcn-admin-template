export type ThemeName =
  | 'light'
  | 'dark'
  | 'deep-violet'
  | 'deep-green'
  | 'peach-light'
  | 'warm-yellow'

export const THEME_OPTIONS: Array<{
  value: ThemeName
  labelZh: string
  labelEn: string
  previewColor: string
}> = [
  { value: 'light', labelZh: '浅色默认', labelEn: 'Light', previewColor: '#3B82F6' },
  { value: 'dark', labelZh: '暗色', labelEn: 'Dark', previewColor: '#4F7DFA' },
  { value: 'deep-violet', labelZh: '深紫', labelEn: 'Deep Violet', previewColor: '#B06BFA' },
  { value: 'deep-green', labelZh: '深绿', labelEn: 'Deep Green', previewColor: '#2CCB9B' },
  { value: 'peach-light', labelZh: '蜜桃', labelEn: 'Peach Light', previewColor: '#ED5F88' },
  { value: 'warm-yellow', labelZh: '暖黄', labelEn: 'Warm Yellow', previewColor: '#E4B007' },
]
