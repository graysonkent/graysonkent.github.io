---
layout: post
date: 2016-07-01 13:00
title:  "Stopping Cisco IOS Domain Name Translation"
mood: speechless
category: 
- errors
- cisco
tags:
- cisco
- errors
- lookup
---

I often switch between Cisco IOS and Bash so I absent-mindedly type 'ls' into a IOS prompt and have to wait 30 seconds on this error:
{% highlight shell %}
router#ls
Translating "ls"...domain server (255.255.255.255)
% Unknown command or computer name, or unable to find computer address
{% endhighlight %}

To stop this, you can just press 'CTRL+Shift+6'. But for more long-term fixes, see the options below:

# Option 1:
Stop router from starting connection without telnet keyword:

{% highlight bash %}
router(config)#ip domain lookup
router(config-line)#line con 0
router(config-line)#transport preferred none
{% endhighlight %}

# Option 2:
Shorten TCP Connection Timeout:

{% highlight bash %}
router(config)#ip tcp synwait-time 10
{% endhighlight %}

This isn't preferable as it can affect things like handshakes for Multicast/BGP

# Option 3:
Disable Domain Lookup:

{% highlight bash %}
router(config)#no ip domain lookup
{% endhighlight %}
I hesitate to recommend this one, though as it might affect the 1% of sites that need it. You can also disable per session Domain Lookup like so:
{% highlight bash %}
#terminal no domain-lookup
{% endhighlight %}
