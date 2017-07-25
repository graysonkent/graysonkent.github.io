window.onload = function () {
  var demo = new Vue({
    el: '.container',
    data: {
      username: 'therealginger',
      exportType: 'favorite_tracks',
      generaltracks: null,
      tracks: null
    },
    watch: {
      username: 'fetchData'
    },
    methods: {
      fetchData: function () {
        var xhr = new XMLHttpRequest()
        var self = this
        xhr.open('GET', 'https://8tracks.com/users/' + self.username + '/favorite_tracks?per_page=300&format=jsonh')
        xhr.onload = function () {
          self.generaltracks = JSON.parse(xhr.responseText)
          self.tracks = self.generaltracks.favorite_tracks
        }
        xhr.send()
      }
    }
  })
}