<template>
  <div
    ref="rooterRef"
    class="suggest"
    v-loading:[loadingText]="loading"
    v-no-result:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-if="singer"
        @click="selectSinger(singer)"
      >
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li
        class="suggest-item"
        v-for="song in songs"
        :key="song.id"
        @click="selectSong(song)"
      >
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">
            {{song.singer}}-{{song.name}}
          </p>
        </div>
      </li>
      <div
        class="suggest-item"
        v-loading:[loadingText]="pullUpLoading"
      ></div>
    </ul>
  </div>
</template>

<script>
import { computed, nextTick, ref, watch } from 'vue'
// hook
import usePullUpLoad from '@/components/search/use-pull-up-load'
// service
import { search } from '@/service/search'
import { processSongs } from '@/service/song'

export default {
  name: 'suggest',
  props: {
    query: String,
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  emits: ['select-song', 'select-singer'],
  setup(props, { emit }) {
    const singer = ref(null)
    const songs = ref([])
    const hasMore = ref(true)
    const page = ref(1)
    const loadingText = ref('')
    const noResultText = ref('抱歉，暂无搜素结果')
    const manualLoading = ref(false) // 是否正在加载更多

    // watch
    watch(() => props.query, async (newQuery) => {
      if (!newQuery) {
        return
      }
      await searchFirst()
    })

    // computed
    const loading = computed(() => {
      return !singer.value && !songs.value.length
    })

    const noResult = computed(() => {
      return !singer.value && !songs.value.length && !hasMore.value
    })

    const pullUpLoading = computed(() => {
      return isPullUpLoad.value && hasMore.value
    })

    // 阻止上拉加载
    const preventPullUpLoad = computed(() => {
      return loading.value || manualLoading.value
    })

    // hooks
    const {
      scroll,
      rooterRef,
      isPullUpLoad
    } = usePullUpLoad(searchMore, preventPullUpLoad)

    // methods
    async function searchFirst() {
      if (!props.query) {
        return
      }
      // 传入新的query，重置搜索值
      page.value = 1
      songs.value = []
      singer.value = null
      hasMore.value = true

      const result = await search(props.query, page.value, props.showSinger)

      songs.value = await processSongs(result.songs)
      singer.value = result.singer
      hasMore.value = result.hasMore

      // 内容不足以填充整个屏幕
      await nextTick()
      await makeItScrollable()
    }

    async function searchMore() {
      if (!hasMore.value || !props.query) {
        return
      }

      page.value++
      const result = await search(props.query, page.value, props.showSinger)

      songs.value = songs.value.concat(await processSongs(result.songs))
      hasMore.value = result.hasMore

      // 内容不足以填充整个屏幕
      await nextTick()
      await makeItScrollable()
    }

    // 每次搜索不足以填充整个屏幕时
    async function makeItScrollable() {
      if (scroll.value.maxScrollY >= -1) {
        // 容器高度大于内容高度，不可滚动
        manualLoading.value = true
        await searchMore()
        manualLoading.value = false
      }
    }

    function selectSong(song) {
      emit('select-song', song)
    }

    function selectSinger(singer) {
      emit('select-singer', singer)
    }

    return {
      singer,
      songs,
      loadingText,
      loading,
      noResult,
      noResultText,
      // pullUpLoad
      rooterRef,
      isPullUpLoad,
      // computed
      pullUpLoading,
      // methods
      selectSong,
      selectSinger
    }
  }
}
</script>

<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^="icon-"] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
