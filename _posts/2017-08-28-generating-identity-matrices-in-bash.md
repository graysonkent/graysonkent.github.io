---
layout: post
date: 2017-08-28 23:00
title:  "Generating Identity Matrices in Bash"
category: blog
tags: Linux/Bash
---
This post is inspired by another blog post called "[How do I modify a variable in Haskell?](http://www.michaelburge.us/2017/08/15/how-do-i-modify-a-variable-in-haskell.html)" by Michael Burge.

It got me thinking about different methods of printing Identity Matrices in Bash (because I am not smart enough to do it in Haskell), and because [Rosetta Code](http://rosettacode.org/wiki/Identity_matrix) was missing a Bash solution. (Update from 9/17/2017: they accepted my solution)

But first off, what is an Identity Matrix?

Identity Matrices
-----------------
> A square matrix in which all the main diagonal elements are 1’s and
> all the remaining elements are 0’s is called an Identity Matrix.
> [Source](http://www.web-formulas.com/Math_Formulas/Linear_Algebra_Definition_of_Identity_Matrix.aspx)

And here is an example ([Source](https://en.wikipedia.org/wiki/Identity_matrix)):

<p align="center">
    <img src="https://grayson.sh/assets/images/matrix.svg" alt="Picture of an Identity Matrix'"/>
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

Update: Galaktos's Pure Bash Method
--------------------------
As always, [/u/galaktos](https://www.reddit.com/user/galaktos) proposed a much cleaner and effective version of my code. I should probably just start sending them my blog before I post it :)

Here is their [reproduced solution](https://www.reddit.com/r/bash/comments/6x8oni/generating_identity_matrices_in_bash/dmeb6to/):

> I wouldn’t even think of doing all that bit shifting or
> multiplication… here’s my take:
>
>
>     for i in {1..20}; do for j in {1..20}; do printf $((i==j)); done; printf '\n'; done
>
>
> Or, in more lines:
>
>
>     for i in {1..20}; do
>         for j in {1..20}; do
>             printf $((i==j))
>         done
>         printf '\n'
>     done
>
>
> If you don’t like the implicit boolean-to-int conversion, you can also
> use `$((i==j?1:0))`. Or `$((i==j ? 1 : 0))` if you’re not golfing.
>
> Unfortunately, brace expansion happens before parameter and variable
> expansion, so just substituting 20 for `$n` doesn’t work if you want
> to make the size variable. But we can use Bash’s alternative for
> syntax for that:
>
>
>     n=${1:-10}
>     for ((i=0;i<n;i++)); do
>         for ((j=0;j<n;j++)); do
>             printf $((i==j))
>         done
>         printf '\n'
>     done
>
> Oh, and shellcheck would prefer `printf '%s' $((i==j))` instead of`
> printf $((i==j))`. Fair enough. (Interestingly, it doesn’t complain
> about the unquoted `$(())` – it seems to know that arithmetic
> expansion can never produce multiple words. But unless I’m missing
> something, it can’t produce a `%` sign that would be interpreted in a
> format string either, can it?)

### Their second solution

The above was already a huge improvement on my loops, but they bested themselves again with a [faster version](https://www.reddit.com/r/bash/comments/6x8oni/generating_identity_matrices_in_bash/dmebj30/):

> Oh, I missed the part where we’re timing this. Here’s a slightly faster version:
>
>     #!/bin/bash
>     n=${1:-10}
>     for ((i=0;i<n;i++)); do
>         line=
>         for ((j=0;j<n;j++)); do
>             line+=$((i==j))
>         done
>         printf '%s\n' "$line"
>     done
>
> But it’s still fairly slow. But hey, it’s pure bash ¯\\\_(ツ)_/¯


Update: ray_gun's wizardry with bc/dc
---------------------------
I was also beaten on the `bc` front with [/u/ray_gun's](https://www.reddit.com/user/ray_gun) inventive `bc` and `dc` [methods](https://www.reddit.com/r/bash/comments/6x8oni/generating_identity_matrices_in_bash/dme8eqy/):

> Another way of getting repeated 0s is multiplying a power of 10 by a
> number and removing that number with `sed` later (here, by 2):
>
>
>     time BC_LINE_LENGTH=0 bc <<< 'r=10000; for ( a = 0; a < r; a++ ) { print 2 * 10^a, 1, 2 * 10^(r - a - 1), "\n" }' | sed 's/2//g'
>     real    0m6.236s
>     user    0m6.415s
>     sys 0m0.476s
>
> 6 seconds instead of the author's 1 minute and 28 seconds.
>
> Here's a faster one (ab)using `bc'`s `scale` and using `sed` to remove
> the leading dot:
>
>
>     time BC_LINE_LENGTH=10050 bc <<< 'scale=10000; 10^-1; for ( a = 0; a < scale-1; a++ ) last/10' | sed 's/^\.//'
>     real    0m1.855s
>     user    0m1.903s
>     sys 0m0.382s
>
>
> `bc` and `dc` can also check if the number they just calculated became
> 0 because internally it won't be more precise than `scale`, e.g. with
> `dc`:
>
>
>     time DC_LINE_LENGTH=10050 dc <<< '10000k [10/ d0=q p ldx]Sd [q]Sq 1 ldx' | sed 's/^\.//'
>     real    0m1.719s
>     user    0m1.716s
>     sys 0m0.404s
>
>
> Edit: `bc` equivalent of the above, it needs `sed` to remove the last
> line (0):
>
>     time BC_LINE_LENGTH=0 bc <<< 'scale=10000; 10^-1; while ( last != 0 ) last/10' | sed '$d;s/^\.//' >/dev/null
>     real    0m1.504s
>     user    0m1.523s
>     sys 0m0.066s


Benchmarking All Methods:
--------------------------
Using a very unscientific method, let's benchmark all the solutions to 10,000 digits on my machine. The methods that can't go above 20 are obviously disqualified, so let's test the others:

### My sed method

```bash
$ time for i in `seq 10000`;do printf '%*s\n' 10000|tr ' ' '0'|sed "s/0/1/$i";done
real	1m31.974s
user	0m29.209s
sys	0m4.848s
```

Ouch. Not looking great so far.

### Galaktos's Pure Bash Method
```bash
$ time ./purebash 10000
real	15m50.447s
user	7m20.544s
sys	0m0.421s
```

Slower, but it ***is*** pure `bash` so it gets extra points for that. I may have also needed to test it in a different way to be fair.

### ray_gun's final bc method
```bash
$ time BC_LINE_LENGTH=0 bc <<< 'scale=10000; 10^-1; while ( last != 0 ) last/10' | sed '$d;s/^\.//'
real	0m17.071s
user	0m2.009s
sys 0m0.340s
```

Much faster than any other method! So use this one if you need to quickly generate huge matrices.

Conclusion
----------
This was an interesting look at just how many methods there are for generating matrices. I especially enjoyed all the community feedback (thanks /r/bash and #bash), and I learned a ton from it.
