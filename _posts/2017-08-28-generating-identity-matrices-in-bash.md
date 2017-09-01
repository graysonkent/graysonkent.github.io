---
layout: post
date: 2017-08-28 23:00
title:  "Generating Identity Matrices in Bash"
category: blog
tags: Linux/Bash
---
This post is inspired by another blog post called "[How do I modify a variable in Haskell?](http://www.michaelburge.us/2017/08/15/how-do-i-modify-a-variable-in-haskell.html)" by Michael Burge.

It got me thinking about different methods of printing Identity Matrices in Bash (because I am not smart enough to do it in Haskell), and because [Rosetta Code](http://rosettacode.org/wiki/Identity_matrix) was missing a Bash solution.

But first off, what is an Identity Matrix?

Identity Matrixes
-----------------
> A square matrix in which all the main diagonal elements are 1’s and
> all the remaining elements are 0’s is called an Identity Matrix.
> - [web-formulas.com](http://www.web-formulas.com/Math_Formulas/Linear_Algebra_Definition_of_Identity_Matrix.aspx)

And here is an example ([Source](https://en.wikipedia.org/wiki/Identity_matrix)):

<p align="center">
    <img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/e1a4218ab6975ad1809415aa168ab6371b91bafc" alt="Picture of an Identity Matrix'"/>
</p>

Alright, let's get to generating them, or you can <a href="#the-dirty-sed-way">jump to my final solution</a>

Using bc
--------

I usually reach for [`bc`](https://ss64.com/bash/bc.html) if I need to do anything somewhat complex arithmetically in Bash. So let's try that first.

With this script, I am going to try to do things "right" and not code-golf yet. It will also default to 10 if no argument is passed.

You can [try it online](https://tio.run/##JY1NDsIgGETX5RTjJybFpOnPUtqbsIFCLQtBi4sm6tmRpLuZ5L0Zo9Oa8/nUGh9aUwp76H0i/rnemr77kWRL3ODhA3id3AvEC0BCwkawys1rBMUiummQBanRYxxRGDTwQpBiVfWFmXGEXW/3hOfmw3sBXbpjzioVypWNweX8Bw "Bash – Try It Online") or here it is:

```bash
#!/bin/bash
max="${*:-10}";
for i in $(seq "$max"); do
	echo "obase=2; $(( 1 << max - i))"\
		| bc \
		| xargs printf "%0"$max"d\\n";
done
```

This isn't super complicated, but I will still break it down:

```bash
max="${*:-10}";
```

Pulls in all arguments, and defaults to 10 if none are provided.

```bash
for i in $(seq "$max"); do
```

Just generate the `seq`uence of 1 to the target number.

```bash
echo "obase=2; $(( 1 << max - i))" | bc
```
This is where it gets fun. The `obase=2` tells `bc` that we want [base 2 instead of base 10](https://www.gnu.org/software/bc/manual/html_mono/bc.html#SEC15) since we are doing bitwise changes next.

Then we do a [left bitwise shift](https://www.gnu.org/software/bash/manual/bash.html#Shell-Arithmetic) of the first argument minus the current position which gives us the numbers we need:

```bash
1000000000
100000000
10000000
1000000
100000
10000
1000
100
10
1
```
But we are missing the padding to make it a true Identity Matrix.

```bash
xargs printf "%0"$max"d\\n";
```

Pipes the output of `bc` to `printf` who uses its `%Wd` [syntax to pad the output](https://ss64.com/bash/printf.html) to `W` characters long, in this case the first argument, and then an [explicitly escaped newline](https://github.com/koalaman/shellcheck/wiki/SC1117).

Which finally gives us what we want:

```bash
1000000000
0100000000
0010000000
0001000000
0000100000
0000010000
0000001000
0000000100
0000000010
0000000001
```

This is kind of wordy though and has a lot of drawbacks. For example:

```bash
$ ./bcIdentityMatrix 20
### Hundreds of Lines ###
printf: ‘10000000000000000000’: Numerical result out of range
```

Ouch. Looks like we are running into our system's `LONG_MAX` of 9223372036854775807 which only gives us a maximum of a 19 digit diagonal matrix. Not very versatile at all.

I probably won't be able to escape that limit while still actually "calculating" the matrix. But I can get rid of our  reliance on `bc`, so let's try a new method without it.

Raising Powers Solution
-----------------------
I am getting bored, so let's code golf this a little, and let's switch to using the powers of 10 to find the next number instead of bitwise shifting since that gave me headaches:

```bash
for i in `seq $(($1-1))|tac`; do printf "%0$1d\n" "$((10**i))";done
```
[Or try it online.](https://tio.run/##DcoxDoAgDADA3VdUxARIjHT2Kw6KYOxSFBj9e3W85MJeL5GhnwPxHH50Zy5AQAxbTQ9oYzROaO3b9mNbIGa4C3E7QY1eY1xZgfoTeufIWrXEzKkTEfQf "Bash – Try It Online")

Not as clear as the last one, but actually simpler in a lot of ways:

```bash
for i in `seq $(($1-1))|tac`; do
```

Generate the `seq`uence of 1 to the first argument minus 1. Then reverse it with it `tac`.

A couple notes:

 - I used the old method of backticks instead of the new `$()` because it saves me a character. Please don't do that.
 - It would be tempting to try to use `rev`, but `tac` is actually much better at interpreting the input from `seq` as a list. The more "standard" solution to this problem is probably `seq $1 -1 0` to count down.
 - I wasted a ton of characters with the `-1` part because otherwise the matrix will be off by one at the top like so:
```bash
10000000000
1000000000
0100000000
0010000000
0001000000
0000100000
0000010000
0000001000
0000000100
0000000010
```

It would probably be faster to have `sed` delete the first line if I had already used it somewhere else. Moving on:

```bash
printf "%0$1d\n" "$((10**i))"
```

Same general idea as the `printf` of my first script. Pad the output of 10, to the [power of the current integer](https://www.gnu.org/software/bash/manual/bash.html#Shell-Arithmetic) (`$((10**i))`), to the width of the first argument (`%0$1d\n`).

Alas, this suffers the same fate of my last script:

```bash
$ ./exponentSolution 20
-8446744073709551616
01000000000000000000
00100000000000000000
00010000000000000000
00001000000000000000
00000100000000000000
00000010000000000000
00000001000000000000
00000000100000000000
00000000010000000000
00000000001000000000
00000000000100000000
00000000000010000000
00000000000001000000
00000000000000100000
00000000000000010000
00000000000000001000
00000000000000000100
00000000000000000010
```

At least we got rid of `bc` though. Let's try faking the calculation.

The dirty sed way
-----------------
We will be stuck on a 19 digit matrix unless we can trick Bash into treating the output as a string, and "calculating" it using a preset number to fill in the 1's as needed:

```bash
for i in `seq $1`;do printf '%*s\n' $1|tr ' ' '0'|sed "s/0/1/$i";done
```

[Or try it online.](https://tio.run/##FYoxDoAgDAB3X1ERQ@JSdPUrDkiA2KUqdfTvFXPTXS7ucqgOPUZijE26clYgIIYg@QY7hzWdcFXip4AbJ9nYtfo@FdyPd6/kBEbQ44yWTNs5q@riPw "Bash – Try It Online")

So let's break this down:

```bash
for i in `seq $1`;do
```

Pretty simple. Generate the `seq`uence of numbers 1, to the value of our first argument.

```bash
printf '%*s\n' $1|tr ' ' '0'
```

Tell `printf` to generate a string that is as long as my first argument. Then `tr` replaces it with a `0`. (Some might know this from [another blog post](https://grayson.sh/blog/some-alternatives-to-hr)). This is what the output looks like right now:

```bash
0000000000
0000000000
0000000000
0000000000
0000000000
0000000000
0000000000
0000000000
0000000000
0000000000
```

Missing some vital `1` characters. Let's fix that:

```bash
sed "s/0/1/$i"
```

Switches a `0` with a `1` in the position that the current loop `$i` is in. And then it generates our matrix as expected:

```bash
$ ./dirtysed 10
1000000000
0100000000
0010000000
0001000000
0000100000
0000010000
0000001000
0000000100
0000000010
0000000001
```

Conclusion
----------
Although I don't like that my final solution doesn't actually calculate anything, it *was* the only one to properly handle large matrices.

[Here it is online with 100 digits](https://tio.run/##FcoxDoAgDEDRqzQE08SFMnsVBzRC7FKUMnL3ivnbyz8Pvc1KbcDAAknzCz6m7arwNJZeAJdVd8GpozfAP8Kh@QKngUIMnt3cJZtZJPoA "Bash – Try It Online"), and I have also tested it on my machine with `10000` and it took 1 minute and 28 seconds. So keep this script in mind if you ever need your laptop to heat up your coffee or look busy.