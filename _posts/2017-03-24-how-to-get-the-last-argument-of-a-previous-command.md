---
layout: post
date: 2017-03-24 21:00
title:  "How to get the last argument of any previous command"
category: blog
tags: Linux
redirect_from:
  - /archive/2017/03/how-to-get-the-last-argument-of-a-previous-command.html
---
You can spice up your day a little bit with `sudo`'s option to insult you when you enter a password wrong. You can set this by adding `Defaults insults` to the `/etc/sudoers` with `sudo visudo`. This tells `sudo` to print responses like this when you enter your password wrong:

```bash
$ sudo su
[sudo] password for gkent: 
No soap, honkie-lips.
[sudo] password for gkent: 
You speak an infinite deal of nothing
[sudo] password for gkent: 
Take a stress pill and think things over.
```

Viewing them all
----------------
I wanted to see what the rest of the stored insults were, and didn't want to enter wrong passwords all day so I went looking for where the insults are stored.

```bash
$ find /usr/lib/sudo -type f | xargs grep "Take a stress pill and think things over."
Binary file /usr/lib/sudo/sudoers.so matches
```

Tells me that they are in `/usr/bin/sudo/sudoers.so`. That is a binary file though and not very human readable, so you have a few options to view them.

```bash
$ strings /usr/lib/sudo/sudoers.so | less
```

Works but that is still 1594 lines of messy output to read through. For a cleaner view, download the `sudo` package and examine the `plugins/sudoers` file:

```bash
$ apt-get source sudo
$ cat sudo*/plugins/sudoers/ins_*.h
```
    
And you can see all of the insults:

**HAL Insults:**

 - Just what do you think you're doing Dave?
 - It can only be attributed to human error.
 - That's something I cannot allow to happen.
 - My mind is going. I can feel it.
 - Sorry about this I know it's a bit silly.
 - Take a stress pill and think things over.
 - This mission is too important for me to allow you to jeopardize it.
 - I feel much better now.

**Classic Insults:**

- And you call yourself a Rocket Scientist!
- No soap honkie-lips.
- Where did you learn to type?
- Are you on drugs?
- My pet ferret can type better than you!
- You type like I drive.
- Do you think like you type?
- Your mind just hasn't been the same since the electro-shock has it?

**CSOps Insults:**

- Maybe if you used more than just two fingers...
- BOB says:  You seem to have forgotten your passwd enter another!
- stty: unknown mode: doofus
- I can't hear you -- I'm using the scrambler.
- The more you drive -- the dumber you get.
- Listen, broccoli brains, I don't have time to listen to this trash.
- Listen, burrito brains, I don't have time to listen to this trash.
- I've seen penguins that can type better than that.
- Have you considered trying to match wits with a rutabaga?
- You speak an infinite deal of nothing

**Goon Show Insults:**

- You silly twisted boy you.
- He has fallen in the water!
- We'll all be murdered in our beds!
- You can't come in. Our tiger has got flu
- I don't wish to know that.
- What what what what what what what what what what?
- You can't get the wood you know.
- You'll starve!
- ... and it used to be so popular...
- Pauses for audience applause not a sausage
- Hold it up to the light --- not a brain in sight!
- Have a gorilla...
- There must be cure for it!
- There's a lot of it about you know.
- You do that again and see what happens...
- Ying Tong Iddle I Po
- Harm can come to a young lad like that!
- And with that remarks folks the case of the Crown vs yourself was proven.
- Speak English you fool --- there are no subtitles in this scene.
- You gotta go owwwww!
- I have been called worse.
- It's only your word against mine.
- I think ... err ... I think ... I think I'll go home

Building your own insults
-------------------------
You can make your own insults by modifying `plugins/sudoers/insults.h` to include the following section in the `insults[]` array where your insults are called `glados`:

    char *insults[] = {
    
    # ifdef HAL_INSULTS
    #  include "ins_2001.h"
    # endif
    
    # ifdef GOONS_INSULTS
    #  include "ins_goons.h"
    # endif
    
    # ifdef CLASSIC_INSULTS
    #  include "ins_classic.h"
    # endif
    
    # ifdef CSOPS_INSULTS
    #  include "ins_csops.h"
    # endif
    
    # ifdef GLADOS_INSULTS
    #  include "ins_glados.h"
    # endif
    
        (char *) 0
    
    };


Then make the file `plugins/sudoers/ins_glados.h` look something like this with some insults from GLaDOS:


    #ifndef _SUDO_INS_GLADOS_H
    #define _SUDO_INS_GLADOS_H
    
        /*
         * Custom Insult Examples from GLaDOS and Portal 2
         */
    
    "Science has now validated your birth mother's decision to abandon you on a doorstep.",
    "Well done. Here come the test results: 'You are a horrible person.' That's what it says. We weren't even testing for that.",
    "Remember before when I was talking about smelly garbage standing around being useless? That was a metaphor. I was actually talking about you. And I'm sorry. You didn't react at the time so I was worried it sailed right over your head. That's why I had to call you garbage a second time just now.",
    "I honestly, truly didn't think you'd fall for that trap. In fact, I designed a much more elaborate trap further ahead for when you got through with this easy one. If I'd known you'd let yourself get captured this easily, I'd have dangled a turkey leg on a rope from the ceiling.",
    "He's not just a regular moron. He's the product of the greatest minds of a generation working together with the express purpose of building the dumbest moron who ever lived.",
    
        
    #endif /* _SUDO_INS_GLADOS_H */


Now recompile `sudo` and you will be insulted however you like when you forget your password!