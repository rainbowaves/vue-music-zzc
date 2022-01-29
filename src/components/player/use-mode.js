import { useStore } from 'vuex'
import { computed } from 'vue'
import { PLAY_MODE } from '@/assets/js/constant'

/**
 * 更改播放序列功能
 * @returns {{modeIcon: ComputedRef<unknown>, changeMode: changeMode}}
 */
export default function useMode() {
  const store = useStore()
  const playMode = computed(() => store.state.playMode)

  // computed
  const modeIcon = computed(() => {
    const playModeVal = playMode.value
    switch (playModeVal) {
      case PLAY_MODE.sequence: return 'icon-sequence'
      case PLAY_MODE.random: return 'icon-random'
      default: return 'icon-loop'
    }
  })
  const modeText = computed(() => {
    const playModeVal = playMode.value
    switch (playModeVal) {
      case PLAY_MODE.sequence: return '顺序播放'
      case PLAY_MODE.random: return '随机播放'
      default: return '单曲循环'
    }
  })

  function changeMode() {
    const mode = (playMode.value + 1) % 3
    store.dispatch('changeMode', mode)
  }

  return {
    modeIcon,
    modeText,
    changeMode
  }
}
