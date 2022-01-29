<template>
  <div class="search">
    <!--   搜索框   -->
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <scroll
      ref="scrollRef"
      class="search-content"
      v-show="!query"
    >
      <div>
        <!--   热门搜索   -->
        <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li
              class="item"
              v-for="item in hotKeys"
              :key="item.id"
              @click="addQuery(item.key)"
            >
              <span>{{item.key}}</span>
            </li>
          </ul>
        </div>
        <!--   搜索历史   -->
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <confirm
            ref="confirmRef"
            text="是否清空所有历史？"
            confirm-btn-text="清空"
            @confirm="clearSearch"
          ></confirm>
          <search-list
            :searches="searchHistory"
            @select="addQuery"
            @delete="deleteSearch"
          ></search-list>
        </div>
      </div>
    </scroll>
    <div class="search-result" v-show="query">
      <suggest
        :query="query"
        @select-song="selectSong"
        @select-singer="selectSinger"
      ></suggest>
    </div>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component"  :data="selectedSinger" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { computed, nextTick, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
// components
import SearchInput from '@/components/search/search-input'
import Suggest from '@/components/search/suggest'
import SearchList from '@/components/base/search-list/search-list'
import Scroll from '@/components/wrap-scroll'
import Confirm from '@/components/base/confirm/confirm'
// hook
import useSearchHistoryList from '@/components/search/use-search-history-list'
// service
import { getHotKeys } from '@/service/search'
// storage
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'

export default {
  name: 'search',
  components: {
    Confirm,
    Scroll,
    Suggest,
    SearchInput,
    SearchList
  },
  setup() {
    const query = ref('')
    const hotKeys = ref([])
    const selectedSinger = ref(null)
    const scrollRef = ref(null)
    const confirmRef = ref(null)

    const store = useStore()
    const searchHistory = computed(() => store.state.searchHistory)

    const router = useRouter()

    const {
      saveSearch,
      deleteSearch,
      clearSearch
    } = useSearchHistoryList()

    // 获取热门搜索数据
    getHotKeys().then((res) => {
      hotKeys.value = res.hotKeys
    })

    // watch
    watch(query, async (newQuery) => {
      if (!newQuery) {
        await nextTick()
        refreshScroll()
      }
    })

    // methods
    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }

    function addQuery(s) {
      query.value = s
    }

    // 点击歌曲
    function selectSong(song) {
      saveSearch(query.value)
      store.dispatch('addSong', song)
    }

    // 点击歌手
    function selectSinger(singer) {
      saveSearch(query.value)
      selectedSinger.value = singer
      cacheSinger(singer)
      router.push({
        path: `/search/${singer.mid}`
      })
    }

    function cacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer)
    }

    function showConfirm() {
      confirmRef.value.show()
    }

    return {
      query,
      hotKeys,
      selectedSinger,
      searchHistory,
      scrollRef,
      confirmRef,
      // methods
      addQuery,
      selectSong,
      selectSinger,
      showConfirm,
      // searchHistory
      deleteSearch,
      clearSearch
    }
  }
}
</script>

<style lang="scss" scoped>
 .search {
   position: fixed;
   width: 100%;
   top: 88px;
   bottom: 0;
   display: flex;
   flex-direction: column;
   .search-input-wrapper {
     margin: 20px;
   }
   .search-content {
     flex: 1;
     overflow: hidden;
     .hot-keys {
       margin: 0 20px 20px 20px;
       .title {
         margin-bottom: 20px;
         font-size: $font-size-medium;
         color: $color-text-l;
       }
       .item {
         display: inline-block;
         padding: 5px 10px;
         margin: 0 20px 10px 0;
         border-radius: 6px;
         background: $color-highlight-background;
         font-size: $font-size-medium;
         color: $color-text-d;
       }
     }
     .search-history {
       position: relative;
       margin: 0 20px;
       .title {
         display: flex;
         align-items: center;
         height: 40px;
         font-size: $font-size-medium;
         color: $color-text-l;
         .text {
           flex: 1;
         }
         .clear {
           @include extend-click();
           .icon-clear {
             font-size: $font-size-medium;
             color: $color-text-d;
           }
         }
       }
     }
   }
   .search-result {
     flex: 1;
     overflow: hidden;
   }
 }
</style>
