import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser/src'

/**
 * 歌词相关功能
 * @param songReady
 * @param currentTime
 * @returns {{lyricScrollRef: null, currentLyric: null, playingLyric: Ref<UnwrapRef<string>>, lyricListRef: null, playLyric: playLyric, pureMusicLyric: Ref<UnwrapRef<string>>, stopLyric: stopLyric, currentLineNum: Ref<UnwrapRef<number>>}}
 */
export default function useLyric(songReady, currentTime) {
  const currentLyric = ref(null) // 当前歌词对象
  const currentLineNum = ref(0) // 当前歌词行号
  const pureMusicLyric = ref('') // 无歌词提示词
  const playingLyric = ref('') // 当前播放歌词行
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)

  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  watch(currentSong, async (newSong) => {
    if (!newSong.url || !newSong.id) {
      return
    }

    // 清空上一次歌词播放的缓存信息
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = 0
    pureMusicLyric.value = ''
    playingLyric.value = ''

    const lyric = await getLyric(newSong)
    store.commit('addSongLyric', { song: newSong, lyric })
    if (currentSong.value.lyric !== lyric) {
      // 避免在请求过程中切换歌曲，导致newSong和currentSong不同
      return
    }
    currentLyric.value = new Lyric(lyric, handleLyric)
    const hasLyric = currentLyric.value.lines.length
    if (hasLyric) {
      if (songReady.value) {
        playLyric()
      }
    } else {
      playingLyric.value =
      pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
    }
  })

  /**
   * 开始播放歌词
   */
  function playLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  /**
   * 暂停播放歌词
   */
  function stopLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }

  // 歌词每切换一行执行回调
  function handleLyric({ lineNum, txt }) {
    currentLineNum.value = lineNum
    playingLyric.value = txt // 当前播放歌词
    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value
    if (!listEl) {
      return
    }
    if (lineNum > 5) {
      // 第5行之后开始滚动
      // 获取屏幕中间的歌词行dom
      // 使得高亮位置始终在中间
      const lineEl = listEl.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      // 保持在顶部
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }

  return {
    currentLyric,
    currentLineNum,
    pureMusicLyric,
    playingLyric,
    lyricScrollRef,
    lyricListRef,
    playLyric,
    stopLyric
  }
}
