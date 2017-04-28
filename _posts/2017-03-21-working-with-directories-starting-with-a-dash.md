---
layout: post
date: 2017-03-03 20:00
title:  "Stopping Cisco IOS Domain Name Translation"
category: blog
tags: linux
redirect_from:
  - /archive/2017/03/working-with-directories-starting-with-a-dash.html
---
If you ever have the misfortune of working with an application that starts its directories with a `-` character, then you will know the pain of pretty much every standard bash tool breaking as they all expect `-` to be used for flags like so:

```bash
$ cd -test
bash: cd: -t: invalid option cd: usage: cd [-L|[-P [-e]] [-@]] [dir]
```

Intuitively, you would think that escaping the string with `-test` would work, but that produces the same error.

To solve this, I had to dive into some [POSIX standards](http://pubs.opengroup.org/onlinepubs/007904875/utilities/xcu_chap01.html#tag_01_11) and discovered that the following is how you safely discard the first argument and not trigger Bash into thinking that `-test` is your flag:

```bash
$ cd -- -test
```
Easy enough once you know that trick. You can also cheat and define the path explicitly, but that isn't as fun to whip out at parties:

```bash
$ cd ./-test
```
