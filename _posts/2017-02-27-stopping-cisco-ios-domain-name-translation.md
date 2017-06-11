---
layout: post
date: 2017-02-27 20:00
title:  "Stopping Accidental Cisco IOS Domain Name Translation"
category: blog
tags: Networking
redirect_from:
  - /archive/2017/02/stopping-cisco-ios-domain-name-translation.html
---
I often switch between Cisco IOS and Bash so I absentmindedly type `ls` into a IOS prompt and have to wait 30 seconds on this error:

> Translating "ls"...domain server (255.255.255.255)  
> % Unknown command or computer name, or unable to find computer address

To stop this, you can just press `CTRL+Shift+6`. But for more long-term fixes, see the options below:

Option 1: Stop router from starting connection without telnet keyword
---------------------------------------------------------------------

    router(config) #ip domain lookup 
    router(config-line)#line con 0
    router(config-line)#transport preferred none

Option 2: Shorten TCP Connection Timeout
----------------------------------------
    router(config) #ip tcp synwait-time 10

This isn’t preferable as it can affect things like handshakes for Multicast/BGP

Option 3: Disable Domain Lookup:
--------------------------------
    router(config) #no ip domain lookup

I hesitate to recommend this one as it might affect the 1% of sites that need it. Also it stops DNS load-balancing, which I need in enterprise environments. You can also disable per session Domain Lookup like so:

    #terminal no domain-lookup

Further Reading
---------------
 - [Cisco Documentation (Jan 2017)](http://www.cisco.com/c/en/us/support/docs/routers/10000-series-routers/46253-ipdomain-lookup.html) 
 - [Key by Key Guide (Dec 2012)](http://smallbusiness.chron.com/disable-dns-lookup-cisco-58863.html)