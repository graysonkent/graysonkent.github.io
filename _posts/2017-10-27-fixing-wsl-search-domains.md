---
layout: post
date: 2017-10-27 23:00
title:  "Broken Search Domain Resolving on Windows Subsystem for Linux"
category: blog
tags: DNS
---
I have recently been playing with Microsoft's newest attempt at "[embrace, extend, and extinguish](https://en.wikipedia.org/wiki/Embrace,_extend,_and_extinguish)" called [Windows Subsystem for Linux (WSL)](https://msdn.microsoft.com/en-us/commandline/wsl/about). 

I can't really give a fair review yet as one the first issues I ran into is its broken DNS setup. After doing some searching, it appears to be related to the fact that WSL can't properly move over multiple Search domains into your Linux's `/etc/resolv.conf`, a common setup in enterprise environments or VPN setups. 

[Microsoft is aware of this issue](https://github.com/Microsoft/WSL/issues/1986) but doesn't seem able/willing to fix it, so here is a workaround:

 1. On your WSL prompt, make a copy of your existing `/etc/resolv.conf`
 

        $ sudo cp /etc/resolv.conf /etc/resolv.conf.new

 
 2. Unlink the existing `/etc/resolv.conf`

 
        $ sudo unlink /etc/resolv.conf


 3. Move the copied version back


        $ sudo mv /etc/resolv.conf.new /etc/resolv.conf

 4. Delete the first line in the file mentioning WSL auto-generation using your text editor or:

        $ sed -i '1d' /etc/resolv.conf

 5. Now on a Windows Command Prompt, run the following:
 
        > ipconfig /all

    and you should get an output like this:
  

        > ipconfig /all
        Windows IP Configuration
    
        Host Name . . . . . . . . . . . . : hostname
        Primary Dns Suffix  . . . . . . . : example.com
        Node Type . . . . . . . . . . . . : Hybrid
        IP Routing Enabled. . . . . . . . : No
        WINS Proxy Enabled. . . . . . . . : No
        DNS Suffix Search List. . . . . . : example1.com
                                            example2.com
                                            example3.com
                                            example4.com
                                            example5.com
                                            example6.com
   

    Mark down the Search List section. The `more` tool is helpful if you have a lot of information to scroll through.

 6. Add the Search List to your `/etc/resolv.conf`. It should look something like this at the end of your file:
 
        search example1.com example2.com example3.com example4.com example5.com example6.com

    Place all your Search Domains on one line with the word "search" at the start. You can have up to 6 domains.

Now save your `/etc/resolv.conf` and you should be good to go!
