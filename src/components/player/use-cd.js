import { useStore } from 'vuex'
import { computed, nextTick, ref, watch } from 'vue'

/**
 * 唱片旋转逻辑
 * @returns {{cdRef: null, cdImageRef: null, isSwitch: Ref<UnwrapRef<boolean>>, cdCls: ComputedRef<string>}}
 */
export default function useCD() {
  const cdRef = ref(null)
  const cdImageRef = ref(null)
  const isSwitch = ref(false)

  const store = useStore()
  const playing = computed(() => store.state.playing)
  const cdCls = computed(() => {
    return playing.value ? 'playing' : ''
  })

  watch(playing, (newPlaying) => {
    if (!newPlaying && !isSwitch.value) {
      syncTransform(cdRef.value, cdImageRef.value)
    }
  })

  watch(isSwitch, async (newVal) => {
    if (newVal === true) {
      resetTransform(cdRef.value, cdImageRef.value)
      // // isSwitch改变太快，导致cdCls返回的依然是'playing'，样式应用失败
      // 这是第一种，还需要在cdCls的返回语句中加上isSwitch的判断
      // await nextTick()
      // isSwitch.value = false
    }
  })

  function syncTransform(wrapper, inner) {
    const wrapperTransform = getComputedStyle(wrapper).transform
    const innerTransform = getComputedStyle(inner).transform

    wrapper.style.transform = wrapperTransform === 'none' ? innerTransform
      : innerTransform + wrapperTransform
  }

  function resetTransform(wrapper, inner) {
    inner.classList.remove('playing')
    wrapper.style.transform = 'none'
    inner.style.transform = 'none'
    nextTick(() => {
      inner.classList.add('playing')
      isSwitch.value = false
    })
  }

  return {
    cdRef,
    cdImageRef,
    isSwitch,
    cdCls
  }
}
