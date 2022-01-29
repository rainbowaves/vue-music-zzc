import { ref, onMounted, onUnmounted, computed, watch, nextTick, onActivated, onDeactivated } from 'vue'
import { useStore } from 'vuex'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

BScroll.use(Slide)

/**
 * 控制 mini-player 的滑动切歌逻辑
 * @returns {{slider: null, sliderWrapperRef: null}}
 */
export default function useMiniSlider() {
  const sliderWrapperRef = ref(null)
  const slider = ref(null)

  const store = useStore()
  const fullScreen = computed(() => store.state.fullScreen)
  const playList = computed(() => store.state.playList)
  // 计算slider是否显示
  const sliderShow = computed(() => !fullScreen.value && !!playList.value)
  const currentIndex = computed(() => store.state.currentIndex)

  onMounted(() => {
    let sliderVal

    // 切换全屏时
    watch(sliderShow, async (newSliderShow) => {
      if (newSliderShow) {
        await nextTick()
        // 初始化BScroll
        if (!sliderVal) {
          // 已经有 BS 对象无序再初始化
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true
            }
          })
          // 切换后改变currentIndex
          sliderVal.on('slidePageChanged', ({ pageX }) => {
            store.commit('setCurrentIndex', pageX)
          })
        } else {
          sliderVal.refresh()
        }
        sliderVal.goToPage(currentIndex.value, 0, 0)
      }
    })

    // 当前歌曲发生变化时
    watch(currentIndex, (newIndex) => {
      if (sliderVal && sliderShow.value) {
        // 本质是dom操作，保证显示时再操作
        sliderVal.goToPage(currentIndex.value, 0, 0)
      }
    })

    // 歌曲列表发生变化，重新刷新
    watch(playList, async (newList) => {
      if (sliderVal && sliderShow.value && newList.length) {
        await nextTick()
        sliderVal.refresh()
      }
    })
  })

  // 销毁slider对象
  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy()
    }
  })

  onActivated(() => {
    scroll.value.enable()
    scroll.value.refresh()
  })

  onDeactivated(() => {
    scroll.value.disable()
  })

  return {
    sliderWrapperRef,
    slider
  }
}
