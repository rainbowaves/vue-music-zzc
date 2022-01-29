import { PLAY_MODE, SEARCH_KEY } from '@/assets/js/constant'
import { load } from '@/assets/js/array-store'

const state = {
  sequenceList: [], // 播放列表
  playList: [], // 实际播放列表
  playing: false, // 是否正在播放
  playMode: PLAY_MODE.sequence, // 播放模式
  currentIndex: 0, // 当前播放歌曲索引
  fullScreen: false, // 是否全屏
  favoriteList: [], // 通过storage读取本地数据   (已在main中进行本地缓存更新)
  searchHistory: load(SEARCH_KEY), // 搜索历史
  playHistory: [] // 播放历史   (已在main中进行本地缓存更新)
}

export default state
