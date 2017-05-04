---
layout: post
date: 2017-05-03 4:00
title:  "How to dynamically change icons in Jekyll"
category: blog
tags: Jekyll
---
This is just a neat trick I picked up while building this site. Since I group by tags, I wanted to change the icons to reflect each tag. 

Here is the relevant part of my `post.html` in my `_layouts` folder that all posts pull their layout from:

{% raw  %}
```html
<link rel="icon" type="image/png" href="/assets/icons/{{ page.tags | first | downcase | strip | default: 'linux' }}.png">
```
{% endraw %}

This allows me to place icons for each tag, named in the format of the tag name and `.png` in my `/assets/icons/xxx.png` dir. It just grabs the first item in the tag array, so it won't work as well if you have a lot of tags. 

> **Note:** You should specify the default logo in case you forget to add one.

Improvements
----
You could easily extend this out by swapping `page.tags` with something like `page.categories` or even do a logic block to assign based on date/author.