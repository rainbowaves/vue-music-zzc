import { ref } from 'vue'

/**
 * 歌词页面与cd页面的切换逻辑
 * @returns {{onMiddleTouchEnd: onMiddleTouchEnd, middleRStyle: null, currentShow: Ref<UnwrapRef<string>>, middleLStyle: null, onMiddleTouchStart: onMiddleTouchStart, onMiddleTouchMove: onMiddleTouchMove}}
 */
export default function useMiddleInteractive() {
  const currentShow = ref('cd') // 即将改变的view，拖动过程中就发生变化
  const middleLStyle = ref(null)
  const middleRStyle = ref(null)

  const touch = {
    startX: 0,
    startY: 0,
    directionLocked: null, // 方向锁
    percent: 0 // 偏移比例
  }

  let currentView = 'cd' // 松开手指再发送变化，用于决定当前屏幕的位移状态

  function onMiddleTouchStart(e) {
    touch.startX = e.touches[0].pageX
    touch.startY = e.touches[0].pageY
    touch.directionLocked = ''
  }

  function onMiddleTouchMove(e) {
    const deltaX = e.touches[0].pageX - touch.startX
    const deltaY = e.touches[0].pageY - touch.startY
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)
    if (!touch.directionLocked) {
      touch.directionLocked = absDeltaX > absDeltaY ? 'h' : 'v'
    }
    if (touch.directionLocked === 'v') {
      return
    }

    const left = currentView === 'cd' ? 0 : -window.innerWidth
    const offsetWidth = Math.min(0, Math.max(left + deltaX, -window.innerWidth))
    // 偏移比例
    touch.percent = Math.abs(offsetWidth / window.innerWidth)
    if (currentView === 'cd') {
      // 在 cd 页面往左滑动
      if (touch.percent > 0.2) {
        currentShow.value = 'lyric'
      } else {
        currentShow.value = 'cd'
      }
    } else {
      // 在 lyric 页面往右滑动
      if (touch.percent < 0.8) {
        currentShow.value = 'cd'
      } else {
        currentShow.value = 'lyric'
      }
    }
    middleLStyle.value = {
      opacity: 1 - touch.percent
      // transitionDuration: '0ms'
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`
      // transitionDuration: '0ms'
    }
  }

  function onMiddleTouchEnd(e) {
    let offsetWidth
    let opacity
    if (currentShow.value === 'cd') {
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric'
      offsetWidth = -window.innerWidth
      opacity = 0
    }

    const duration = 300
    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: `${duration}ms`
    }
  }

  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd
  }
}
