---
layout: post
date: 2017-03-24 21:00
title:  "How to get the last argument of any previous command"
category: blog
tags: bash
redirect_from:
  - /archive/2017/03/how-to-get-the-last-argument-of-a-previous-command.html
---
**Short Answer**

    !-2$
    
Where -2 is any integer describing how far back in history you want to go for the last command. So -3 would the third to last command you entered.

**Long Answer**

One of my favorite time-saving commands in Bash is `!$` which recalls the last argument of the last entered command. This is incredibly useful in situations like this:

```bash
$ mkdir superlongnamethatidontwanttotypeout
$ cd !$ && pwd
superlongnamethatidontwanttotypeout
```

Similarly, `!!` recalls the entirety of the last command and `!-2` recalls the next to last command from history like so:

```bash
$ touch example1
$ touch example2
$ !-2
touch example1    
```                         
This can be extended out with negative integers to go back lines in Bash history, or a positive integer to start from beginning.

> **Note:** If you need more functionality, you should really learn the [`fc` builtin command](https://www.systutorials.com/docs/linux/man/1p-fc/).  
> It lets you yank a range of commands from history like `fc -2 -4`, throws it
> in your `$EDITOR` for review, and then execute the command on exit.

With the `!-2` logic in mind, I thought `!$-2` would work but you get the following result:

```bash
$ touch example1
$ touch example2
$ vim !$-2
vim example2-2
```                           
As you can see, that expands the last argument and then just inserts -2 instead of interpreting it as a negative line number as I want. I thought this was odd so I researched more and realized that I had a fundamental misunderstanding of how `!$` works.

The [Bash Manual](https://www.gnu.org/software/bash/manual/bashref.html#Word-Designators) says:

> `!!:$` designates the last argument of the preceding command.  
> This may be shortened to `!$`.

                    
So `$` is actually an event specification on `!!` and thus `!$` is **not** a completely separate word designator from `!!` as I thought. Knowing that, we just need to use `!-2$` like so:

```bash
$ touch example1
$ touch example2
$ vim !-2$
vim example1      
```         
This gets us the last argument of the next to last command and can also be modified to grab different lines like the !-2 command.

> **Note:** `$_` is another beast entirely as it works on executed commands and not entered commands like `!$` who needs something to be
> in history for it to work.

Conclusion
----------
Bash History is an incredibly deep topic with a lot of interesting shortcuts. If you want learn more, I would suggest setting `shopt -s histverify` to get a better picture of how the shell interprets your commands.