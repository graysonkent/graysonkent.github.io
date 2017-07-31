---
layout: post
date: 2017-07-31 23:00
title:  "Some alternatives to the terminal hr"
category: blog
tags: Miscellaneous
---
I was helping my friend track down a bug in their spider webs of Bash scripts when I ran across a library named [hr](https://github.com/LuRsT/hr). I had never heard of it, but it bills itself as  "A horizontal ruler for your terminal". This works by outputting characters (default is #) to the length of your terminal screen. Not something I see the need for, but apparently over 1,000 people on Github do.

I dug into the [source](https://github.com/LuRsT/hr/blob/master/hr) for fun, and it comes down to this:

```bash
#!/bin/bash
COLS="$(tput cols)"
if (( COLS <= 0 )) ; then
    COLS="${COLUMNS:-80}"
fi

hr() {
    local WORD="$1"
    if [[ -n "$WORD" ]] ; then
        local LINE=''
        while (( ${#LINE} < COLS ))
        do
            LINE="$LINE$WORD"
        done

        echo "${LINE:0:$COLS}"
    fi
}

hrs() {
    local WORD

    for WORD in "${@:-#}"
    do
        hr "$WORD"
    done
}

[ "$0" == "$BASH_SOURCE" ] && hrs "$@"
```

I would personally just output 80 #'s and call it a day, but those loops looked really inefficient so I decided to have some fun with it. 

Stress Testing
-------------------
Since `hr` just uses `tput cols` to grab the screen width, then lets feed `tput` some fake values. 

Without boring your head off, `tput` grabs its values from the `terminfo` file and outputs them. 

A back-handed way to confuse `tput` is by adjusting `stty` values like so:

```bash
$ tput cols
205
$ stty cols 32767
$ tput cols
32767
```
We chose 32767 because that is the max `col` value allowed as it is C's `SHRT_MAX` value.  Any higher will overflow to `-1` which we don't want. Here is how you could find that out:

```bash
$ sed -n 's/#  define SHRT_MAX\(.*\)/\1/p' /usr/include/limits.h
32767
```
Alright, so now that `tput` thinks that we have a 30,000+ columned screen; let's see how `hr` does:

```bash
$ time ./hr
real	0m25.751s
user	0m24.403s
sys	0m1.175s
```
Ouch, almost 26 whole seconds to fill my fake screen with #'s. The audience watching my ASCII art performance on the 300 foot screen during the Super Bowl half time will not appreciate that lag /s. Let's see if we can do better.

Restrictions:
-----------------
I am trying to keep feature-parity with `hr` so my program needs to print the 32767 required characters. It will default to the `#` character to fill the screen if no other character is supplied as the first argument. 

I am trying for speed, not readability or maintainability. I will use `GNU time 1.7` with an average of 3 tries to control for the I/O cache. 

My first (naive) one-liner attempt
---------------------------------
```bash
CHARS=${*:-#};printf -v LINES'%*s' "$(tput cols)";echo "${LINES// /$CHARS}"
```
I tried to avoid the loops entirely and went for an approach combining `echo` and `printf`. 

```bash
$ time ./naive
real	0m0.840s
user	0m0.746s
sys	0m0.001s
```
Doing 25 seconds better so far,  but I want faster.

Seq to tr
------------
Let's cut out printing statements entirely and trust my reliable builtin friends:

```bash
CHARS=${*:-#};LINES="$(tput cols)";seq -s"$CHARS" "$LINES"|tr -d '[:digit:]'
```

```bash
$ time ./olreliables
real	0m0.039s
user	0m0.009s
sys	0m0.005s
```
Much better! But I bet we can get it faster

/dev/zero Speedup
---------------------------
A favorite trick of mine when needing to generate anything quickly is abusing `/dev/zero`:

```bash
CHARS=${*:-#};LINES="$(tput cols)";head -c "$LINES" /dev/zero | tr '\0' "$CHARS"
```

```bash
$ time ./theflash
real	0m0.030s
user	0m0.000s
sys	0m0.003s
```
Great! Saving that crucial .009s of runtime. Critics might point out that this isn't POSIX because of the `head -c` part, so let's fix that. 

POSIXy Way
----------------
```bash
CHARS=${*:-#};LINES="$(tput cols)";printf '%*s' "$LINES" | tr ' ' "$CHARS"
```
```bash
$ time ./funpolice
real	0m0.030s
user	0m0.000s
sys	0m0.003s
```
Perfect. Now it is fast and can satisfy everyone. Here is the code-golfed version:

```bash
C=${*:-#};L=`tput cols`;printf '%*s' $L|tr ' ' $C
```
49 bytes of fast code. But that got me thinking: "Since we are manipulating text, won't `perl` be faster?"

Perl 5 way
--------------
Obviously, there are about 500 different ways to write this in `Perl` so I am not going to try them all, but here is the first one I wrote:

```bash
$ARGV[0]||='#';$K=`tput cols`;print"$ARGV[0]"x$K;
```
This gets me:
```bash
$ time ./gottagofast.perl
real	0m0.029s
user	0m0.009s
sys	0m0.002s
```
So a .001s savings. Not as much as I thought it would be. 

Conclusion
---------------
This is obviously just me being stupid and having fun pushing software where it wasn't intended to go. I appreciate all the `hr` devs do for the community, and their script works great on any normal sized screen. 

Now time to get back to actual work :(