import { fest } from '../../content'

const LINES = ['CORE // POWER ........ OK', 'GRID // SYNC ......... OK', 'CITY // WAKING']

export const BOOT_FONT = '700 100px Doto'

// Draws the loading UI onto a 2D canvas that becomes the cloth texture.
export function drawBoot(canvas, width, height, dpr, pct) {
  const w = Math.max(1, Math.round(width * dpr))
  const h = Math.max(1, Math.round(height * dpr))
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
  }
  const ctx = canvas.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  // fabric base: dark violet-gray with a faint weave so folds can catch light
  ctx.fillStyle = '#17151f'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = 'rgba(255,255,255,0.035)'
  for (let y = 0; y < height; y += 4) ctx.fillRect(0, y, width, 1)
  ctx.fillStyle = 'rgba(255,255,255,0.02)'
  for (let x = 0; x < width; x += 4) ctx.fillRect(x, 0, 1, height)

  const gutter = Math.min(64, Math.max(20, width * 0.04))
  const readout = (px) => `700 ${px}px Doto, "Courier New", monospace`

  ctx.textBaseline = 'top'
  ctx.letterSpacing = '0.12em'

  ctx.font = readout(14)
  ctx.fillStyle = '#b3aec6'
  ctx.fillText(fest.name, gutter, gutter)
  const nameW = ctx.measureText(fest.name).width
  ctx.fillStyle = '#f5b942'
  ctx.fillText(fest.year, gutter + nameW + 10, gutter)

  const pctSize = Math.min(288, Math.max(96, width * 0.24))
  ctx.font = readout(pctSize)
  ctx.letterSpacing = '0em'
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'right'
  ctx.fillStyle = '#c4b5fd'
  ctx.fillText(String(pct).padStart(3, '0'), width - gutter, height - gutter)

  ctx.textAlign = 'left'
  ctx.textBaseline = 'bottom'
  ctx.letterSpacing = '0.12em'
  ctx.font = readout(13)
  const visible = LINES.filter((_, i) => pct > 25 + i * 25)
  visible.forEach((line, i) => {
    const last = i === visible.length - 1
    ctx.fillStyle = last ? '#f5b942' : '#b3aec6'
    ctx.fillText(line, gutter, height - gutter - (visible.length - 1 - i) * 22)
  })
}
