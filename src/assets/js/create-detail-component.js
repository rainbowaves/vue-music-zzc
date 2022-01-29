import MusicList from '@/components/music-list/music-list'
import storage from 'good-storage'
import { processSongs } from '@/service/song'

/**
 * 创建类详情页面组件
 * @param name
 * @param key
 * @param fetch
 */
export default function createDetailComponent(name, key, fetch) {
  return {
    name,
    components: {
      MusicList
    },
    props: {
      data: Object
    },
    data() {
      return {
        songs: [],
        loading: true
      }
    },
    computed: {
      computedData() {
        let ret = null
        const data = this.data
        if (data) {
          ret = data
        } else {
          const cached = storage.session.get(key)
          if (cached && (cached.mid || cached.id + '') === this.$route.params.id) {
            ret = cached
          }
        }

        return ret
      },
      pic() {
        const data = this.computedData
        return data && data.pic
      },
      title() {
        const data = this.computedData
        return data && (data.name || data.title)
      }
    },
    async created() {
      const data = this.computedData
      if (!data) {
        // 如果没有就回退到上一个页面
        const path = this.$route.matched[0].path
        this.$router.push({ path })
        return
      }
      // 抓取数据
      const result = await fetch(data)
      // 映射歌曲url
      this.songs = await processSongs(result.songs)
      this.loading = false
    }
  }
}
