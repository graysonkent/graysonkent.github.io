---
layout: post
date: 2017-03-27 21:00
title:  "Find which Linux commands can make words out of their options"
category: blog
tags: linux
redirect_from:
  - /archive/2017/03/find-which-linux-commands-can-make-words-with-their-options.html
---
> **Update 4/17:** Cleaned up the code after some help from the gurus on [codereview.stackexchange.com](https://codereview.stackexchange.com/questions/160959/try-every-option-for-a-command-and-make-anagrams-out-of-the-successful-ones)

I noticed that I always prefer using commands with options that spell out common words like `ps -elf` or `ls -cat` as they are easier to remember, so I decided to write a script to find out where other instances like this can happen:

```bash
#!/bin/bash
 
# Pull in a list of common Linux commands
commandList=( $(
  curl 'http://www.thegeekstuff.com/2010/11/50-linux-commands/' \
  2> /dev/null \
    | grep -o '<h3>\([0-9].*[a-z][a-z][a-z].*\)</h3>' \
    | awk '{ print $2 }' \
    | grep -vE 'rm|wget|less|shutdown|<h3>'
) );
 
# Pipe successful `$command -$option` pairs to `an` to generate anagrams
for command in $commandList ; do
        (for option in {a..z} ; do
                if timeout -k 5 5 "$command" -$option &> /dev/null; then
                                printf $option
                fi
        done) | xargs an -w -d saneWordlist -m 3 2> /dev/null \
              | sed "s/^/ '$command' -/" >> commandOptions.log
done
```
Ugly, and not something I would ever put my name on professionally, but it gets the job done. It produces over 12,000 `command -word` combinations with the 50 sample input Linux commands. Here are some of my favorites it found:

```bash
ls -afro
ls -grinch
ls -algorithm
ls -akimbo
ls -albino
ls -angst
ls -badmouth
ls -calming
ls -flamingos
ls -frogman
ls -gambit
ls -groans
ls -gulps
ls -hacking
ls -hustling
ls -liar
ls -nachos
ls -obfuscating
ls -prodigal
ps -centaur
ps -gnu
ps -manure
ps -nuclear
free -tomb
free -bolt
df -milk
df -ham
mount -swirl
uname -savior
uname -prison
uname -pain
whereis -bums
whereis -bus
```
So I guess the lesson here is that `ls` can take pretty much any option.

How it works
------------
It starts by pulling in a blog post of example Linux commands because I am too lazy to write them all out:

```bash
curl 'http://www.thegeekstuff.com/2010/11/50-linux-commands/' 2> /dev/null
```
After it has that input, it searches for the tag that contains the titles of the command `<h3>` with `grep`, then uses `awk` to delimit the fields and print the next to last one where our command is. `sed` then throws out any line containing commands we don't want like `rm`:

```bash
| grep -o '<h3>\([0-9].*[a-z][a-z][a-z].*\)</h3>' \
| awk '{ print $2 }' \
| grep -vE 'rm|wget|less|shutdown|<h3>'
```
For example, this pulls out just the command tar from:

    <h3>1. tar command examples</h3>

Each of the 50 example commands are now stored in commandList like so:

```bash
commandList=( $(
  curl 'http://www.thegeekstuff.com/2010/11/50-linux-commands/' \
   2> /dev/null \
    | grep -o '<h3>\([0-9].*[a-z][a-z][a-z].*\)</h3>' \
    | awk '{ print $2 }' \
    | grep -vE 'rm|wget|less|shutdown|<h3>'
) );
```
Then it iterates through the commandList and tries each command with every letter as an option. It has 5 seconds to run before SIGKILL is sent:

```bash
for command in $commandList ; do
    (for option in {a..z} ; do
        if timeout -k 5 5 "$command" -$option &> /dev/null 2>&1; then
```
If it exits successfully, loop through and output successful options without a new line character. Otherwise, do nothing:

```bash
    printf "$option"
fi
```
At the end of that, output successful options to [`an`](http://manpages.ubuntu.com/manpages/trusty/man6/an.6.html), a tool for generating anagrams. Allow only words over 3 characters and use a custom dictionary I made:

```bash
xargs an -w -d saneWordlist -m 3 2> /dev/null  
```                    
Here is how I made my custom dictionary:

```bash
grep -v '[[:punct:]]' /usr/share/dict/words | sed  's/é/e/g' > saneWordlist
```
After an generates anagrams, let `sed` insert the command name at the start of the anagram list so we can identify who it belongs to and append to a file:

```bash
sed "s/^/ '$command' -/" >> commandOptions.log
```
As I said earlier, this is an ugly program. It is not made to exhaustively find each command option, but rather generate a good list to look through.

Areas for Improvement
---------------------
- I don't look for capitalized options because I didn't want to deal with trying to match up words that start with that letter.

- If I did it again, I would have written this in Python just for the array options.

- I abused sed and awk in places where I should have just used a more robust regex match

- If you wanted to play Russian roulette with your computer, you could switch out the command from commandList with `compgen -cb`. I would write a log file to a remote location and add in `trap`s in case one of the commands brought down your machine.

- Lastly, this script is inherently flawed as I am relying on exit codes that are not at all consistent and just hoping the devs used 0 to indicate success. Commands like `vim` and `passwd` can't even be killed reliably by GNU's timeout without affecting the exit code. I don't currently know a better workaround that doesn't require a large amount of time for marginally better results. Initially I was grepping through man pages looking for flags, but that leads to the same inconsistency issue as exit codes:

```bash
man --where --all "$command" > /dev/null 2>&1
if (($? == 0)); then
    mapfile -t commandOptions < <(
    printf "$i-" && man $i \
    | sed -ne 's/.*\(-[A-Za-z],\).*/\1/p' \
    | sort -u \
    | tr -d ',-' \
    | tr -d '\n')                  
```
