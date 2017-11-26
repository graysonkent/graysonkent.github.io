---
layout: post
date: 2017-06-16 23:00
title:  "How to get the exit status of a failed pipe in Bash"
category: blogs
tags: Linux/Bash
---
The traditional method of accessing the exit status of a command in Bash is through the `$?` [internal variable](http://tldp.org/LDP/abs/html/internalvariables.html#XSTATVARREF) like so :

```bash
$ true
$ echo $?
0
```

But what if your first command fails and you pipe it to another command that will always succeed?

```bash
$ false
$ echo $?
1
$ false | tee log
$ echo $?
0
```

Thankfully, there are a few different ways to handle accessing the exit code for the correct command in the pipe.

Via $PIPESTATUS
---------------
The `$PIPESTATUS` array is made up of the exit status of each command in a pipe. Learn more on the [Advanced Bash-Scripting Guide](http://tldp.org/LDP/abs/html/internalvariables.html).

You can use:

```bash
$ false | tee log
$ echo "${PIPESTATUS[0]} ${PIPESTATUS[1]}"
1 0
```
You can also use `${PIPESTATUS[*]}` or `${PIPESTATUS[@]}`.

**Note:** `$PIPESTATUS` suffers from the usual issue of misbehaving when you pipe `ls` (which is why I never pipe `ls` when possible),  so `$PIPEFAIL` may be a better option in those cases.

Via $PIPEFAIL
------
In Bash version 3 and beyond, you can use `set -o pipefail` to set the exit status to the status of the last failed command in a pipe instead of the last command in a pipe.

Via mispipe
------
The [`moreutils`](http://joeyh.name/code/moreutils/) package includes a command named `mispipe` that has similar functionality to `${PIPESTATUS[0]}`.

I don't personally like installing extra software when I can just use Bash functionality, but not every user or OS has that option.

`mispipe` works by taking two arguments and returning the exit status of the first:

```bash
$ mispipe true false
$ echo $?
0
```
This has the advantage of only returning the exit status of the first command instead of triggering on any failure of the pipe sequence.

Conclusion
-----
There are a variety of different ways to recover the exit status of a failed pipe in the sequence, and there are a lot more that I didn't cover like creating your own named pipes with `mkfifo` or a tmp file with `mktemp` that stores the array of each exit status. These aren't typically needed on a standard Linux/Bash install that you aren't too worried about being POSIX compliant though.