---
layout: post
date: 2017-07-31 23:00
title:  "Alternatives to the 'hr' library"
category: blogs
tags: Linux/Bash
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

I am trying for speed, not readability or maintainability. I will use `Bash time` with an average of 3 tries to control for the I/O cache.

My first (naive) one-liner attempt
---------------------------------
```bash
printf -v LINES '%*s' "$(tput cols)";echo "${LINES// /${*:-#}}"
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
Let's cut out printing statements entirely:

```bash
seq -s"${*:-#}" "$(tput cols)"|tr -d '[:digit:]'
```

```bash
$ time ./sequenced
real	0m0.039s
user	0m0.009s
sys	0m0.005s
```

Much better! But I bet we can get it faster.

The ol' /dev/zero Speedup
---------------------------
A favorite trick of mine when needing to generate anything quickly is abusing `/dev/zero`:

```bash
head -c "$(tput cols)" /dev/zero | tr '\0' "${*:-#}"
```

```bash
$ time ./theflash
real	0m0.030s
user	0m0.000s
sys	0m0.003s
```

Great! Saving that crucial .009s of runtime. Critics might point out that this isn't POSIX because of the `head -c` part, so let's fix that.

POSIX-ish Way
----------------

```bash
printf '%*s' "$(tput cols)" | tr ' ' "${*:-#}"
```

```bash
$ time ./funpolice
real	0m0.030s
user	0m0.000s
sys	0m0.003s
```

Perfect. Now it is fast and can satisfy everyone. Here is the code-golfed (and unsafe )version:

```bash
printf '%*s' `tput cols`|tr ' ' ${*:-#}
```

39 bytes of fast code. But that got me thinking: "Since we are manipulating text, won't `perl` be faster?"

Perl 5 way
--------------
Obviously, there are about 500 different ways to write this in `Perl` so I am not going to try them all, but here is the first one I wrote:

```bash
printf"${ARGV[0]||='#'}"x`tput cols`
```

This gets me:

```bash
$ time ./gottagofast.perl
real	0m0.029s
user	0m0.009s
sys	0m0.002s
```

So a .001s savings, but in only 36 Bytes. Not as much as I thought it would be. Let's go lower.

C Method
--------
[Galaktos](https://www.reddit.com/user/galaktos), on my Reddit [post](https://www.reddit.com/r/bash/comments/6qvwlg/some_alternatives_the_hr_library/), suggested this solution:

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/ioctl.h>

int main(int argc, char *argv[]) {
  char c = argc > 1 ? argv[1][0] : '\0';
  c = c ?: '#';

  struct winsize w;
  ioctl(STDOUT_FILENO, TIOCGWINSZ, &w);

  for (int i = 0; i < w.ws_col; i++)
    putchar(c);

  return EXIT_SUCCESS;
}
```

And as expected, it is very fast:


```bash
$ time ./letsgetlow
real	0m0.027s
user	0m0.000s
sys	0m0.001s
```

So that is our current winner with a .002s savings over the `perl` script! Also, thanks again to [Galaktos](https://www.reddit.com/user/galaktos) for pointing out some other technical issues I had with my testing and terminology. I really appreciate it.

Bonus: Wrapped in a function
------------------------------------------
Again on the Reddit post, [whetu](https://www.reddit.com/user/whetu) shared his version of my one-liner to be used in a function:

```bash
hr() {
  printf '%*s\n' "${1:-$COLUMNS}" | tr ' ' "${2:-#}"
}
```

This is really cool because now it can also "output a specific width or the full width based on a positional parameter"

```bash
$ hr 80
################################################################################
$ hr 40
########################################
```

and with specific characters:

```bash
$ hr 20 $
$$$$$$$$$$$$$$$$$$$$
$ hr 20 \*
********************
```

This is now closer to feature-parity with the actual `hr` library. And I could actually see using this for error messages.

Thanks again for the examples and the code, [whetu](https://www.reddit.com/user/whetu). And shoutout to [/r/bash](https://www.reddit.com/r/bash/).

Conclusion
---------------
This is obviously just me being stupid and having fun pushing software where it wasn't intended to go. I appreciate all the `hr` devs do for the community, and their script works great on any normal sized screen.

Now time to get back to actual work :(
