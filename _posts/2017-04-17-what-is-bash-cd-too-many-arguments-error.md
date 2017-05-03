---
layout: post
date: 2017-04-17 21:00
title:  "What is 'bash: cd: too many arguments' error?"
category: blog
tags: Linux
redirect_from:
  - /archive/2017/04/bash.4.4.cd.pattern.matching.regression.html
---
[This question](https://askubuntu.com/q/905832/668095) popped up on StackOverflow last night and I thought it was interesting that `cd` initially looks like it doesn't behave like `ls` in regards to pattern matching, even though they are both builtins.

The person was using `cd album*` to move into the first directory out of a set of `album-0{1..2}` directories.

This stopped working with an upgrade to Ubuntu 17.04 (and subsequently Bash-4.4-RC1) and instead threw this error:

> bash: cd: too many arguments

I would never personally rely on this matching behavior, but it *is* interesting that it is saying `cd` is having an issue with multiple arguments as the [Bash manual's `cd` section](https://www.gnu.org/software/bash/manual/bash.html#index-cd) even says that:


> Any additional arguments following directory are ignored.

What changed?
-------------
Looking through the Bash Source Code, I noticed one interesting commit that added the following to [`config-top.h`](http://git.savannah.gnu.org/cgit/bash.git/tree/config-top.h#n30):

```c
/* Define CD_COMPLAINS if you want the non-standard, but sometimes-desired
   error messages about multiple directory arguments to `cd'. */
 
#define CD_COMPLAINS
```
And the specific error message from the question is mentioned in [`builtins/cd.def`](http://git.savannah.gnu.org/cgit/bash.git/tree/builtins/cd.def#n326):

```c
#if defined (CD_COMPLAINS)
  else if (list->next)
    {
      builtin_error (_("too many arguments"));
      return (EXECUTION_FAILURE);
    }
#endif
```

Proving it
----------
Bash 4.4 Beta where it still works:

```bash
#Pulling and unpacking source
$ wget https://ftp.gnu.org/gnu/bash/bash-4.4-beta.tar.gz
$ tar -xzvf bash-4.4-beta.tar.gz
$ cd bash-4.4-beta
 
#Building, go grab something to drink. It's gonna be a while.
~/bash-4.4-beta$ ./configure
~/bash-4.4-beta$ make
 
#Check Version
~/bash-4.4-beta$ ./bash --version
GNU bash, version 4.4.0(1)-beta (x86_64-unknown-linux-gnu)
 
#Enter a clean interactive prompt
~/bash-4.4-beta$ env -i PATH="$PWD:$PATH" ./bash --noprofile --norc
 
#Test example
bash-4.4$ mkdir album-0{1..2}
bash-4.4$ cd album* && pwd
/home/gkent/bash-4.4-beta/album0-1
```
Bash 4.4 Stable Release where it doesn't work:

```bash
#Pulling and unpacking source
$ wget https://ftp.gnu.org/gnu/bash/bash-4.4.tar.gz
$ tar -zxvf bash-4.4.tar.gz
$ cd bash-4.4/
 
#Building, go grab something to drink. It's gonna be a while.
~/bash-4.4$ ./configure
~/bash-4.4$ make
 
#Check Version
~/bash-4.4$ ./bash -version
GNU bash, version 4.4.0(1)-release (x86_64-unknown-linux-gnu)
 
#Enter a clean interactive prompt
~/bash-4.4$ env -i PATH="$PWD:$PATH" ./bash --noprofile --norc
 
#Test example
bash-4.4$ mkdir album-0{1..2}
bash-4.4$ cd album*
bash: cd: too many arguments
```

So what now?
------------
It seems that the implementation of `cd` and the documentation of it got off somewhere along the way. A [bug report](https://bugs.launchpad.net/ubuntu/+source/bash/+bug/1683576) was filed from that thread, so we will see the response on that. If you truly depend on this pattern matching functionality, then you could build your own Bash and remove the `CD_COMPLAINS` or override the command like [Byte Commander](https://askubuntu.com/a/905851/668095) suggested:

```bash
cd(){ builtin cd "${@:1:1}"; }
```

But that comes with its own issue of remembering to unset that if you need to test the real `cd`. Finally, you could go out of your way and make a working function alias out of something like this:

```bash
cd "$(find $1* | head -1)"
```
