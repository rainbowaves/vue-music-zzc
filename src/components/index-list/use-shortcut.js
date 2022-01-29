import { computed, ref } from 'vue'

export default function useShortcut(props, groupRef) {
  const ANCHOR_HEIGHT = 18
  const scrollRef = ref(null)

  // 侧边字母列表
  const shortcutList = computed(() => {
    return props.data.map(group => {
      return group.title
    })
  })

  const touch = {}

  function onShortcutTouchStart(e) {
    const anchorIndex = parseInt(e.target.dataset.index)
    touch.y1 = e.touches[0].pageY
    touch.anchorIndex = anchorIndex

    scrollTo(anchorIndex)
  }

  function onShortcutTouchMove(e) {
    touch.y2 = e.touches[0].pageY
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0 // 整数向下取整的写法math.floor()
    const anchorIndex = touch.anchorIndex + delta // 初始索引加上移动的偏移量
    scrollTo(anchorIndex)
  }

  // 移动到指定下标对应的歌手列表组位置
  function scrollTo(index) {
    if (isNaN(index)) return // 当点击div时，获取的是div而不是其列表ul元素
    // 避免拖得太远导致index超出范围
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const targetElement = groupRef.value.children[index]
    const scroll = scrollRef.value.scroll
    scroll.scrollToElement(targetElement, 0)
  }

  return {
    scrollRef,
    shortcutList,
    onShortcutTouchStart,
    onShortcutTouchMove
  }
}
