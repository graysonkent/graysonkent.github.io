---
layout: post
date: 2017-03-13 20:00
title:  "Calculating the odds of a SHA-1 Collision"
category: blog
tags: security
d3Load: true
math: true
sha: true
redirect_from:
  - /archive/2017/03/calculating-odds-of-sha1-collision.html
---

With the announcement that [Google has developed a technique to generate SHA-1 collisions](https://security.googleblog.com/2017/02/announcing-first-sha1-collision.html), albeit with huge computational loads, I thought it would be topical to show the odds of a SHA-1 collision in the wild using the Birthday Problem.

But first, some background:

The Birthday Problem
--------------------
This famously counter-intuitive paradox states that in a room of 23 people there is a 50% chance that two people would share a birthday. If you up the amount of people to 75, then your odds go up to 99.9%

It's probably up there with the [Monty Hall Problem](https://en.wikipedia.org/wiki/Monty_Hall_problem) for most argued about popular probability puzzle, but it actually makes a lot of sense when you break it down.

The confusion usually comes from the fact that we are thinking about 1/365 odds for each of the 23 people instead of the odds of not getting a match in a pair, of which we have:
$$\frac{23\times22}{2}=253 \text { Combinations}$$

Ignoring messy, real-world statistics like how birthdays tend to group together:

<div id="chart"></div>
<script type="text/javascript" src="/assets/js/d3/births.js"></script>


Then, you can calculate the probability of two people not having the same birthday with:
$$p \approx 1 -\left (\dfrac{364}{365}\right)^{x(x-1)/2}$$
​​ 
Where x = 23 people, we get .500477154 or just over 50% chance of a match.

SHA-1 Background
----------------

Secure Hash Algorithm 1 (SHA-1) was developed by the NSA in 1995 and it is used commonly in security protocols and version control systems, although it is being phased out in favor of more secure hash functions.

In a **very** simplified way it works by padding, appending, expanding, compressing, and splitting the input data into blocks and then adding the result to a hash state that generates the 160-bit final hash known as a Message Digest.

This hash is often represented as a 40 digit hexadecimal number. See below for an example or input your own text to see the hash:

<div align="center">
	<label for="message">
		<b><span class="label">Input Text:</span></label></b>
	<input id="message" value="SHA-1 is Outdated"></input>
	<b><label for="digest">Hash:</label></b>
	<input id="digest" readonly="readonly" value="bd6ccd94ba309828d2b0ce4b37bdb635f0c9b731" type="text">
</div>


You can read the [full RFC](https://tools.ietf.org/html/rfc3174) if you want to dive deeper into the internals of SHA-1

The Birthday Problem Applied
----------------------------
So how does the Birthday Problem relate to SHA-1 collisions? Instead of finding matches between people's birthdays, now you can find matches in 160 bit hashes.

Diverging from the math we did in first section, we are going to cheat and use an approximation for the finding the amount of files needed for a 50% chance of a match or 'collision' in SHA-1.

A good approximation of a 50% chance of a match is the square root of (d) where d is 365. That gives us 19 people needed for a 50% chance at a match. Kind of close to the actual answer of 23, but it doesn't really matter much when dealing with huge numbers like the SHA-1 domain.

Using that approximation for SHA-1 with a 160-bit hash:

$$\sqrt{{2}^{160}} = {{2}^{80}} \approx 1,208,925,819,614,629,174,706,176$$
To put that into perspective, Facebook and Twitter could decide to identify posts using SHA-1 and it would still take them over 3,400 years of data, assuming no growth and always unique messages, before they even had to worry about a 50% chance of a collision.

An upgrade to SHA3-512 or even SHA-256 algorithms and they would need to worry more about the heat death of the universe than a collision.

Q&A
---
**So how was Google able to brute-force a collision?**

> They didn't. At least not entirely. They found a break allowing them
> to get the domain down to below \\( 2^63 \\) and then throw all their might at
> "one of the largest computations ever completed."

**Does this mean I should stop using Git?**

> Only if you want to. [Linus isn't
> worried](https://plus.google.com/+LinusTorvalds/posts/7tp2gYWQugL) and
> neither am I. Git doesn't rely on SHA-1 for security of
> authentication, more so just identifying files. Beyond that, it goes
> through a lot of [extra steps before
> check-in](https://gist.github.com/masak/2415865).
> 
> From the perspective of attacking the Linux Kernel, to pull off an
> attack like Google's you would need a blackbox like pdf files or
> binary blobs to obfuscate the code and then you would have to switch
> out the matching document at a distribution point. All in, probably
> costing you at least a million. And it all still hinges on the repo
> owner accepting your code. Heck, it would be easier to spend that
> million to pick up a few people at The [International Obfuscated C
> Code Contest](http://www.ioccc.org/), clone an evil Andrew Morton or
> work on exploits for [Intel's hidden
> CPU](https://boingboing.net/2017/06/15/intel-x86-processors-ship-with.html).
> 
> That's not to say that they shouldn't migrate to a better algorithm,
> but it isn't a dire situation.

Conclusion
----------
With society so reliant on algorithms, it will be interesting to see which ones are proven secure. SHA-1 took over 10 years for theoretical attacks, and over 20 years for a proven one and that was with an nearly unfathomable amount of power on the mathematically flawed Message Digest algorithm family. SHA-3 is promising with its [sponge design](https://www.fbi.h-da.de/fileadmin/personal/h.baier/Lectures-summer-13/SS-13-Cryptography/lecture_crypto_ss13_chapter09-sha3-handout.pdf) to add another layer of complexity, but it might also prove trivial to the computers of the future.