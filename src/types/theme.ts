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
  // 预览色块使用「背景色同色相的提亮值」：
  // - 避免深色主题块过暗难区分
  // - 保留主题基调（而非改成完全无关的高饱和色）
  { value: 'light', labelZh: '浅色默认', labelEn: 'Light', previewColor: 'hsl(220 35% 98%)' },
  { value: 'dark', labelZh: '暗色', labelEn: 'Dark', previewColor: 'hsl(224 42% 14%)' },
  { value: 'deep-violet', labelZh: '深紫', labelEn: 'Deep Violet', previewColor: 'hsl(264 44% 18%)' },
  { value: 'deep-green', labelZh: '深绿', labelEn: 'Deep Green', previewColor: 'hsl(164 58% 14%)' },
  { value: 'peach-light', labelZh: '蜜桃', labelEn: 'Peach Light', previewColor: 'hsl(350 78% 97%)' },
  { value: 'warm-yellow', labelZh: '暖黄', labelEn: 'Warm Yellow', previewColor: 'hsl(45 90% 94%)' },
]
