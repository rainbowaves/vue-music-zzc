import { h, mergeProps, withCtx, renderSlot, ref, computed, watch, nextTick } from 'vue'
import Scroll from '@/components/base/scroll/scroll'
import { useStore } from 'vuex'

/**
 * 这个组件的目的是为了使 mini-player 出现时，滚动页面高度可以自动调整
 *
 * 使用渲染函数实现scroll的高阶组件
 * 也就是要render出template部分，如下
 * ```
 * <scroll
 *  ref="scrollRef"
 *  v-bind:"$props"
 *  @scroll="$emit('scroll',$event)"
 * >
 *  <slot></slot>
 * </scroll>
 * ```
 */
export default {
  name: 'wrap-scroll',
  props: Scroll.props,
  emits: Scroll.emits,
  render(ctx) {
    return h(Scroll, mergeProps({
      ref: 'scrollRef'
    }, ctx.$props, {
      onScroll: (e) => {
        ctx.$emit('scroll', e)
      }
    }), {
      // 渲染children 也就是 slot 插槽
      default: withCtx(() => {
        return [renderSlot(ctx.$slots, 'default')]
      })
    })
  },
  setup() {
    const scrollRef = ref(null)

    const store = useStore()
    const playList = computed(() => store.state.playList)

    // 第一次scrollRef值 null，可以把它变成响应式
    // 当访问到scrollRef时，才计算
    const scroll = computed(() => {
      return scrollRef.value.scroll
    })

    watch(playList, async () => {
      await nextTick()
      scroll.value.refresh()
    })

    return {
      scrollRef,
      scroll
    }
  }
}
