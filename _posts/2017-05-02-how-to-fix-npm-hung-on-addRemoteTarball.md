---
layout: post
date: 2017-05-02 21:00
title:  "How to fix an npm install that is hung on addRemoteTarball"
category: blog
tags: npm
---
I was trying to install a package today and `npm` just kept spinning and never finished. It is usually slow at work, but not this bad. I ran it with `--verbose` and got a line like the following:

```bash
> npm install -g gulp --verbose
npm verb addRemoteTarball   'xxxx' 
```

And then it wouldn't continue.

The Problem
------------
I had two paths set in my `TMP` variable on Windows. You can check your full `npm` config with `npm config ls -l`, but here is the line that was giving me trouble:

```bash
> npm config get tmp
C:\Users\gkent\AppData\Local\Temp;C:\ffmpeg\bin
```
Note the second path of `C:\\ffmpeg\\bin` separated by a `;`.

Option 1: Specify the TMP dir
------------
You can add the real `TMP` location to your user config:

```bash
> npm config set tmp %USERPROFILE%\AppData\Local\Temp
```

To apply it globally, run the command with a `-g` flag at the end.

You can also set `TMP` dir on each `npm` command like so:

```bash
> npm install --tmp %USERPROFILE%\AppData\Local\Temp -g gulp
```
This is fine temporarily, but annoying to remember to do.

Option 2: Change the TMP environment variable
-----
Change your `TMP` path to only have 1 location like so:
 1. From the desktop, right click the Computer icon. 
 2. Choose Properties from the context menu. 
 3. Click the Advanced system settings link.
 4. Click Environment Variables. 
 5. In the section User Variables, find the `TMP` environment variable and select it. 
 6. Click Edit. 
 7. Delete the second string after the `;`
 8. Click OK. 
 9. Restart your `cmd` prompt or program you are using to access `npm`
 
Now you can install packages like normal, but just remember to set the path of `TMP` back if you need it for a program like I do.