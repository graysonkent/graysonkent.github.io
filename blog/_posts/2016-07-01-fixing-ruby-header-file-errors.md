---
layout: post
date: 2016-07-01 13:00
title:  "Fixing Ruby Header File Error"
mood: speechless
category: 
- errors
- ruby
tags:
- ruby
- errors
- headers
---

While building out this site, I ran into a Ruby error I hadn't seen before

{% highlight ruby linenos %}
Building native extensions.  This could take a while...
ERROR:  Error installing json:
        ERROR: Failed to build gem native extension.

/usr/bin/ruby extconf.rb
mkmf.rb can't find header files for ruby at /usr/lib/ruby/ruby.h
{% endhighlight %}

This is solved by just installing ruby-dev like so:
{% highlight bash linenos %}
sudo apt-get install ruby-dev
{% endhighlight %}
