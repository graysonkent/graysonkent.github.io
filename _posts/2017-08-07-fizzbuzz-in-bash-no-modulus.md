---
layout: post
date: 2017-08-07 23:00
title:  "FizzBuzz in Bash with no Modulus or for/while loops"
category: blog
tags: Linux
---
A few days ago on #bash, people were sharing their least favorite interview questions. During that discussion, FizzBuzz inevitably came up. If you don't know what that is, here are the rules:

> Write a short program that prints each number from 1 to 100 on a new
> line.
>
> For each multiple of 3, print "Fizz" instead of the number.
>
> For each multiple of 5, print "Buzz" instead of the number.
>
> For numbers which are multiples of both 3 and 5, print "FizzBuzz"
> instead of the number.

The most common solutions to this problem hinge upon knowing the [Modulus Operator](https://en.wikipedia.org/wiki/Modulo_operation) to test for the remainder of a number after division. In this case, testing 3, 5, and 15 for remainders and then looping through to print.

That is boring though, so let's do it with no modulus, no for/while loops, and trying to save as many characters as possible.

You can <a href="#somewhat-cheating-solution">jump to my final solution</a> if you don't want to see the steps to get there.

Step 1: Printing Numbers 1-100
---------------------------------------------
Reaching for `echo {1..100}` or a `printf` variant would be an obvious choice here, but remember that I am trying to save characters, so let's use `seq 100`.

Step 2: Finding a way to test for divisibility:
--------------------------------------------------------------
I can't use a modulus operator, so that throws out the conventional methods for these kind of tests.

With that in mind, let me introduce `factor`:

    factor [NUMBER]...

    Print the prime factors of each specified integer NUMBER.

[Some people question](https://www.reddit.com/r/linux/comments/6ruqj4/why_does_the_coreutils_include_factor/) why this command is even in `coreutils`, but it is perfect for our purpose.

Since 3 and 5 are both prime, then we can skate by using `factor` on each number, like in this shorter example:

```bash
$ seq 10 | factor
1:
2: 2
3: 3
4: 2 2
5: 5
6: 2 3
7: 7
8: 2 2 2
9: 3 3
10: 2 5
11: 11
12: 2 2 3
13: 13
14: 2 7
15: 3 5
```
I'll handle the non-prime (15) in the next step.

Step 3: Formatting our lines
----------------------------------------
First off, I want to say thank you to [/u/neilmoore](https://www.reddit.com/user/neilmoore) for fixing some issues with my first script.

Alright, we have our list and our factors. Let's start FizzBuzzing.

I chose `sed` over my preferred tool for this kind of job (`awk`) because of the modulus operator issue again.

All I am doing with `sed` is a simple replace. Let's start with 15 since I will need to pipe that other `sed` substitutions later:

```bash
$ seq 15 |factor | sed 's/.*3 * 5.*/FizzBuzz/g'
1:
2: 2
3: 3
4: 2 2
5: 5
6: 2 3
7: 7
8: 2 2 2
9: 3 3
10: 2 5
11: 11
12: 2 2 3
13: 13
14: 2 7
FizzBuzz
```
> **Note:** I am kind of cheating here. Since 15 isn't a prime number, it can't be included in `factor`, but instead I can look to see if 3 and 5 appear on the same line. If these were any other number pairs I might have to worry, but since anything ending with a 3 is divisible by 3 and the same for 5, then I am good to just ignore the `??: ` output from `factor`.

Alright, let's add in the tests for 3 and 5:

```bash
$ seq 100 | factor | sed 's/.*3 * 5.*/FizzBuzz/g; s/.* 5\( .*\|$\)/Buzz/g; s/.* 3\( .*\|$\)/Fizz/g'
1:
2: 2
Fizz
4: 2 2
Buzz
Fizz
7: 7
8: 2 2 2
Fizz
Buzz
11: 11
Fizz
13: 13
14: 2 7
FizzBuzz
#### Continued to 100 ####
```
> **Note:** If you didn't know, `sed` commands can be chained together using `;` or `-e` with separate commands, but I am trying to save space so I went for the less readable `;`. Learn more in the `sed` [manual](https://www.gnu.org/software/sed/manual/sed.html#Multiple-commands-syntax).

We're getting there now. The last remaining issue is to get rid of the `factor` output of primes after the `:` sign with one more chained `sed` command:

```bash
$ seq 100 | factor | sed 's/.*3 * 5.*/FizzBuzz/g; s/.* 5\( .*\|$\)/Buzz/g; s/.* 3\( .*\|$\)/Fizz/g; s/:.*//g'
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
#### Continued to 100 ####
```

Perfect. This is a nice little one-liner, but I bet we can make it smaller.

(Somewhat) Cheating Solution
-------------------------------------------
Although I love `factor` and will always defend it, there is a simpler way that doesn't use it at all.

While reading through the `sed` manual for the earlier script, I stumbled upon the section on [Selecting lines by numbers](https://www.gnu.org/software/sed/manual/sed.html#Numeric-Addresses). The syntax of `sed 'first~step'` lets me select lines by multiples of a certain number. You can probably guess where this is going.

Without having to use `factor` at all, I am left with this:

```bash
$ seq 100|sed '0~5s/.*/Buzz/g;0~3s/.*/Fizz/g;0~15s/.*/FizzBuzz/g'
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
#### Continued to 100 ####
```
Instead of a find and replace based on prime factors, I am running through line numbers with multiples of 3, 5, or 15 and replacing the whole line.

The `sed` section differs only slightly from my other solution in that the search for 15 happens last so it doesn't get overwritten by the 3 or 5 replacements.

This is only 64 characters, but I called this somewhat cheating because I don't really feel that it is in the spirit of the question to just hard-code values, but it works.

Conclusion
---------------
This was a fun exercise in a challenge everyone loves to hate. Hopefully I get a chance to use it in the future.

Please let me know if you find a smaller solution, I would love to share it!
