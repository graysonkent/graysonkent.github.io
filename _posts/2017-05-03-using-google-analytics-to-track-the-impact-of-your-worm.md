---
layout: post
date: 2017-05-03 2:00
title:  "Using Google Analytics to the track the spread of your worms"
category: blog
tags: Security
---
Recently, some Google users were hit by a phishing email telling them that someone shared a file with them on Google Drive.

It looked legit and even splashed up a Google account login page. The only clue that it wasn't real was if you noticed it came from `hhhhhhhhhhhhhhhh@mailinator.com` a few steps in.
 
It was a clever trick relying on the fact that Google apparently lets you name an app "Google Drive" and use their api for login/actions. Probably why Apple won't let you have the word "Apple" or "Android" in your [app title](http://www.pcworld.com/article/188696/Apple_Bans_the_Word_Android_From_App_Store.html). You can read a more thorough write-up of the scam on the [Reddit thread it was reported on.](https://www.reddit.com/r/google/comments/692cr4/new_google_docs_phishing_scam_almost_undetectable/dh36pv2/)

This is all cleared up now as Google banned the account in 30 mins, but the funniest part is in *how* they did it. 

The Code
---
On the now defunct website of the worm author, you can read the code they used. It's incredibly bad and copied+pasted from StackOverflow, but the funniest part is that they use the boiler-plate Google Analytics to track the spread of their own worm on a Google platform:

```js
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-98290545-1', 'auto');
  ga('send', 'pageview');
</script>
```


That just made my day. What's next? Using Google Analytics to track your phishing campaign that is a website on Google Cloud attacking Gmail users?

If you are interested, [here](https://hastebin.com/gubegaqusi.xml) is an  archive of one of their files. They even leave the comments from the Google API example guide.
 
It makes you wonder how much damage a more experienced dev could have done.