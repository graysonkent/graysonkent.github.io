---
layout: post
date: 2017-03-24 20:00
title:  "Setting up spell check for navigating directories"
category: blogs
tags: Linux/Bash
redirect_from:
  - /archive/2017/03/setting-up-spellcheck-for-navigating-directories.html
---
This is a neat trick I somehow just learned about. By running:

```bash
$ shopt -s cdspell
```
You can set Bash to fix minor spelling errors in cd commands. Here is an example:

```bash
$ mkdir spellingIsHard
$ cd spelingIsHard
bash: cd: spelingIsHard: No such file or directory
$ shopt -s cdspell
$ cd spelingIsHard
spellingIsHard
/spellingIsHard$
```

This only works in the interactive shell (for good reason) and I wish there was a `set` equivalent so it would be more portable, but overall this a very handy option.

Further Reading:
----------------
 - [`shopt` builtin man page](http://www.gnu.org/software/bash/manual/html_node/The-Shopt-Builtin.html)
 - [Other Example Usages -cyberciti (Mar 2016)](https://bash.cyberciti.biz/guide/Shopt)