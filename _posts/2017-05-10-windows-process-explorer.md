---
layout: post
date: 2017-05-10 2:00
title:  "Windows Process Explorer: A better Task Manager"
category: blog
tags: Windows
---
I was playing around trying to port some device drivers on Windows 7 for fun and got really frustrated with the options for viewing library calls.  Compared to [`ltrace`](https://www.freebsd.org/cgi/man.cgi?query=ltrace&manpath=SuSE%20Linux/i386%2011.3) on UNIX-like platforms, there wasn't a readily apparent way to quickly view library calls in realtime that didn't involve writing some wrapper code.

My issue, like most of my Microsoft problems, was solved by downloading a random .exe buried in the Microsoft Technet; this time [Process Explorer v16.2](https://technet.microsoft.com/en-us/sysinternals/bb896653.aspx). 

This might be well known on the Windows dev side, and I am sure a lot of them are rolling their eyes at me right now, but it really impressed me. Here are of its features:

Handle Mode
------------
In Handle Mode, activated by pressing the button circled in red, the top window shows active processes and the bottom shows handles opened by the process. 
<p align="center">
<img src="/assets/images/ProcessExplorer/HandleMode.png"/>
</p>

DLL Mode
---------
This is closer to what I was looking for. In this mode, the processes show the libraries and memory mapped files they have opened.
<p align="center">
<img src="/assets/images/ProcessExplorer/DLLMode.png"/>
</p>

> **Side Note:** SysWOW64 is *actually* the folder for 32-bit applications on a 64-bit Windows install. It's a redirect for `%windir%System32`. Aptly named because you say "Wow" when you think about what decisions lead to that naming choice \s.

Search
------
You can perform a lookup based on DLL or Handle name by navigating to **Find -> Find Handle or DLL** or pressing CTRL+F.

<p align="center">
<img src="/assets/images/ProcessExplorer/Search.png"/>
</p>

This could be useful for times when you can't delete a file because Windows says a process has a lock on it. So you can search by that file name and kill the associated process.

System Information Dashboard
----------------------------
This was one of the most unexpected features for me. A beautiful (in my opinion) and simplistic performance dashboard.

<p align="center">
<img src="/assets/images/ProcessExplorer/Dashboard.png"/>
</p>

The CPU detail View
<p align="center">
<img src="/assets/images/ProcessExplorer/CPUView.png"/>
</p>

Compare that with the dashboard in Task Manager
<p align="center">
<img src="/assets/images/ProcessExplorer/TaskManager.png"/>
</p>

Replacing Task Manager Entirely
-------------------------------
If I have won you over that Process Explorer is better than Task Manager, you can replace it on your system by choosing **Options -> Replace Task Manager**.

Concerns
--------
Letting any third party software take over part of your system is generally not advised, but this package comes from [sysinternals.com](sysinternals.com) and is endorsed by Microsoft and co-developed by a Microsoft CTO. 

It goes against all of my open-source tendencies, but this is an amazing tool and I hope Windows includes more of these options by default in the future.