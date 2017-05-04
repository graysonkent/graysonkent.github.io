---
layout: post
date: 2017-05-03 6:00
title:  "How to escape tags in Jekyll"
category: blog
tags: Jekyll
description: "How to escape tags in Jekyll or Liquid to output literal curly braces"
---
This was buried surprisingly deep in the Jekyll documentation. To escape a block of code or tags, use the `{{ "{% raw " }}%}` tag like so:

{% raw  %}

```js
&#123;% raw  %&#125;
   {{ page.tags }}
&#123;% endraw %&#125;
```

{% endraw %}

Which will output the unformatted string of `{{ "{{ page.tags " }}}}`
