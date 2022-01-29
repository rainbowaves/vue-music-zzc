import { ref, watch, nextTick, computed } from 'vue'

/**
 * 固定悬浮字母列表
 */
export default function useFixed(props) {
  const TITLE_HEIGHT = 30
  const groupRef = ref(null) // 歌手列表父节点dom
  const listHeight = ref([])
  const scrollY = ref(0)
  const currentIndex = ref(0) // 当前渲染组索引下标
  const distance = ref(0) // 当前组的下一个组距离顶部容器距离

  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return ''
    }
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })

  // 标题推动效果
  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT) ? (distanceVal - TITLE_HEIGHT) : 0
    return {
      transform: `translate3d(0, ${diff}px, 0)`
    }
  })

  // 监听数据变化，重新计算高度数组
  watch(() => props.data, async () => {
    await nextTick() // 数据变了，dom不会马上变
    calculate()
  })

  // 监听滚动，实时改变currentIndex内容
  watch(scrollY, (newY) => {
    const listHeightVal = listHeight.value
    for (let i = 0; i < listHeightVal.length - 1; i++) {
      const heightTop = listHeightVal[i]
      const heightBottom = listHeightVal[i + 1]
      if (newY >= heightTop && newY <= heightBottom) {
        currentIndex.value = i
        distance.value = heightBottom - newY
      }
    }
  })

  function calculate() {
    const list = groupRef.value.children // 子组件列表
    const listHeightVal = listHeight.value
    let height = 0

    listHeightVal.length = 0
    listHeightVal.push(height)

    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      listHeightVal.push(height)
    }
  }

  function onScroll(pos) {
    scrollY.value = -pos.y
  }

  return {
    groupRef,
    onScroll,
    fixedTitle,
    fixedStyle,
    currentIndex
  }
}
