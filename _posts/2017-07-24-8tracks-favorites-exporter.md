---
layout: post
date: 2017-07-24 20:00
title:  "8tracks.com Favorites Exporter"
category: project
tags: ['Web Apps']
vue: true
---
<script type="text/javascript">
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

</script>

  <div class="container">
    <p>Ever since Grooveshark shut down, I have been really cautious about storing all my music online.</p>
    <p>With 8tracks.com's recent changes (limiting free listening to an hour, disabling international playback, etc.), I figured it was a good time to release this.</p>
    <p>Put in your 8tracks username to get a list of your favorited tracks. You can also use my <a href="https://github.com/graysonkent/misc-scripts/blob/master/bash/8tracks.sh">command-line version</a> if that is more your speed.</p>
    
  </br>

<div style="font-size:40px; text-align:center">
   <span>Username:</span>
   <input type="text" v-model="username">
   <a href="#" style="text-decoration:none;" @click.stop="fetchData">Load Favorites</a>
</div>

    
  <div contenteditable="true" v-if="tracks != null">
     <table>
       <tr align="left">
         <th>Song</th>
         <th>Artist</th>
       </tr>
       <tr v-for="(item, index) in tracks" :key="item.name"/>
         <td>{{ item.name }}</td>
         <td>{{ item.performer }}</td>
       </tr>
     </table>

   </div>
     <h2>FAQ's</h2>
     <p><strong>Can I export the track list of my favorited mixes?</strong></p>
     <blockquote><p>No. That is near impossible as 8tracks.com very strongly protects the track list for each mix.</p></blockquote>
     <p><strong>Why are some songs repeated multiple times?</strong></p>
     <blockquote><p>This is just an issue with how 8tracks identifies songs. I can't really do anything about it without accidentally getting rid of songs, which I don't want to do.</p></blockquote>
     <p><strong>Can you provide the link for each song instead?</strong></p>
     <blockquote><p>No. 8tracks hooks into the youtube api to do that (poorly) and that would cost me money, so you will have to find links on your own.</p></blockquote>
     <p><strong>What will you do with my data?</strong></p>
     <blockquote><p>Nothing. I don't even have Google analytics turned on for this website and I don't log anything. Feel free to look at the <a href="">source</a> or view my <a href="https://github.com/graysonkent/misc-scripts/blob/master/bash/8tracks.sh">command-line version</a></p></blockquote>
  </div>