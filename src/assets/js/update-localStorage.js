import { load, saveAll } from '@/assets/js/array-store'
import { FAVORITE_KEY, PLAY_KEY } from '@/assets/js/constant'
import { processSongs } from '@/service/song'
import store from '@/store'

export default function updateLocalStorage() {
  updateFavoriteSongs()
  updateHistorySongs()
}

function updateFavoriteSongs() {
  const favoriteSongs = load(FAVORITE_KEY)
  if (favoriteSongs.length > 0) {
    processSongs(favoriteSongs).then((songs) => {
      store.commit('setFavoriteList', songs)
      saveAll(songs, FAVORITE_KEY)
    })
  }
}

function updateHistorySongs() {
  const historySongs = load(PLAY_KEY)
  if (historySongs.length > 0) {
    processSongs(historySongs).then((songs) => {
      store.commit('setPlayHistory', songs)
      saveAll(songs, PLAY_KEY)
    })
  }
}
