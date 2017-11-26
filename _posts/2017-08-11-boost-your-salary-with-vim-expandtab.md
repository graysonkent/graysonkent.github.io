---
layout: post
date: 2017-08-11 23:00
title:  "Increasing your salary 8.6% with Vim's :expandtab"
category: blogs
tags: Vim
---
Recently, Stack Overflow published a [blog post claiming that Developers who use spaces make 8.6% more than those who use tabs](https://stackoverflow.blog/2017/06/15/developers-use-spaces-make-money-use-tabs/).

I am not sure I entirely agree with it, but the numbers don't lie. So for the tabbers out there, let's boost your salary with Vim's [`:expandtab`](http://vimdoc.sourceforge.net/htmldoc/options.html#%27expandtab%27) option.

Repent your old ways
------------------------------
Before you can get that extra [2.4 years of salary bump](https://stackoverflow.blog/2017/06/15/developers-use-spaces-make-money-use-tabs/), you must first forsake your old gods and make a sacrifice to the spaces lifestyle.

To do that, you'll need to change all your old projects from tabs to spaces with the [`:retab`](http://vimdoc.sourceforge.net/htmldoc/change.html#:retab) option.

It keys off the [`:tabstop`](http://vimdoc.sourceforge.net/htmldoc/options.html#%27tabstop%27) and [`:shiftwidth`](http://vimdoc.sourceforge.net/htmldoc/options.html#%27shiftwidth%27) values, so set those:

```
:set tabstop=2 shiftwidth=2
```

[Google's style guide suggests two spaces](https://google.github.io/styleguide/shell.xml?showone=Indentation#Indentation) and you need to blindly follow anything they do, so that is what I went with here.

Now you can purge your mistakes:

```
:retab
```

You can even be a 10Xer engineer and open your repo in Vim to fix all the tabs at once:

```
:argdo retab
```

Take the rest of the day off and sleep easy knowing you won't be laid off anytime soon.

Protecting yourself going forward
-------------------------------------------------
You can never let yourself slip back into your heretical former life, so add the following to your `.vimrc`:

```
:set shiftwidth=2 tabstop=2 expandtab
```

The [`:expandtab`](http://vimdoc.sourceforge.net/htmldoc/options.html#%27expandtab%27) option works by replacing tabs with spaces when you forget the one true way. To insert a real tab, please shut off your computer and go to your local unemployment office.

Look into [:smarttab](http://vimdoc.sourceforge.net/htmldoc/options.html#%27smarttab%27) options if you want fine grained control over how tab characters are interpreted in context.

Conclusion
---------------
I hope that I helped someone out there reach their true potential earnings. Tune in next week to my series on "Using tea leaves to pick your next framework".