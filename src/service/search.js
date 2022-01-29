import { get } from './base'

export function getHotKeys() {
  return get('/api/getHotKeys')
}

export function search(query, page, showSinger) {
  if (!query) {
    return
  }
  return get('/api/search', {
    query,
    page,
    showSinger
  })
}
