---
layout: post
date: 2017-03-26 21:00
title:  "Generating a random list of Linux commands for A-Z"
category: blog
tags: Linux/Bash
redirect_from:
  - /archive/2017/03/generating-a-random-list-of-linux-commands-for-a-to-z.html
---

I was out at lunch with a friend who has been interviewing for Senior Linux Engineer positions, and he mentioned one of the interview problems he had was this:

> Write down a list of Linux commands for each letter in the alphabet

Pretty easy for someone with 20+ years experience, but the interesting aspect to this question was that they said they asked this because "It was impossible to program out an answer"

I was immediately skeptical as there has been very few things I haven't been able to eventually script out.

Sure enough, it was a very simple one-liner when I remembered the [`compgen`](https://www.gnu.org/software/bash/manual/html_node/Programmable-Completion-Builtins.html) built-in:

```bash
for i in {a..z}; do compgen -c "$i" | shuf -n 1; done
```

Will generate a random list of commands A-Z. For one example:

```bash
apt-cdrom
bluez-test-audio
cpgr
dmsetup
expr
from
gnome-thumbnail-font
hpljP1007
iptables-xml
jockey-text
koi8rxterm
lodraw
mcomp
nm-tool
orca
pod2text
quote_readline
readlink
sleep
totem-video-indexer
ucfq
validlocale
wmctrl
xzcat
yelp
zgrep
```
I would have preferred to stick to only built-ins, but you wouldn't have been able to complete the problem that way:

```bash
$ for i in {a..z}; do compgen -b "$i" | shuf -n 1; done
alias
bind
cd
disown
export
fg
getopts
hash
jobs
kill
local
mapfile
popd
read
shift
trap
unalias
wait
```
So apparently there are no built-ins starting with "I,N,O,Q,V,X,Y,Z". Now *that* would have been a hard interview question.
