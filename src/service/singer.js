import { get } from './base'

/**
 * 获取歌手列表
 * @returns {Promise<* | void>}
 */
export function getSingerList() {
  return get('/api/getSingerList')
}

/**
 * 获取单个歌手详情
 * @param singer
 * @returns {Promise<* | void>}
 */
export function getSingerDetail(singer) {
  return get('/api/getSingerDetail', {
    mid: singer.mid
  })
}
