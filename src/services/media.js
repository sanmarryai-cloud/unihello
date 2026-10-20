/** 防盗链签名是演示桩：不校验，也不改真实播放地址。 */

export const SAMPLE_MP4 =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'

const previews = new Map()

export function rememberPreview(id, url) {
  if (id && url) previews.set(id, url)
}

export function isHls(url) {
  return /\.m3u8(\?|$)/i.test(url || '')
}

export function signMediaUrl(rawUrl, ttlSec = 3600) {
  const url = rawUrl || ''
  const expiresAt = Date.now() + ttlSec * 1000
  if (!url || url.startsWith('blob:') || url.startsWith('data:')) {
    return { url, signedUrl: url, expiresAt, signed: false }
  }
  let token = 'demo'
  try {
    token = btoa(`${expiresAt}:${url}`).replace(/=+$/g, '').slice(0, 28)
  } catch {
    token = 'demo'
  }
  const join = url.includes('?') ? '&' : '?'
  return {
    url,
    signedUrl: `${url}${join}exp=${expiresAt}&sign=${token}`,
    expiresAt,
    signed: true,
  }
}

/** video 上存的是 id 时走内存预览，否则直接签名该 URL。 */
export function resolveMedia(video) {
  const raw = (video && previews.get(video.id)) || video?.src || ''
  const signed = signMediaUrl(raw)
  return { ...signed, hls: isHls(raw) }
}
