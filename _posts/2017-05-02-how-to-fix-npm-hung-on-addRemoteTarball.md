---
layout: post
date: 2017-05-02 21:00
title:  "How to fix npm hung on addRemoteTarball"
category: blog
tags: npm
---
I was trying to install a package today and `npm` just kept spinning and never finished. It is usually slow at work, but not this bad. I ran it with `--verbose` and got the following:

```bash
$ npm install -g gulp --verbose
---Hundreds of lines of config---
npm verb addRemoteTarball https://registry.npmjs.org/gulp/-/gulp-3.8.11.tgz not in flight; adding
npm verb addRemoteTarball [ 'https://registry.npmjs.org/gulp/-/gulp-3.8.11.tgz',
npm verb addRemoteTarball   'd557e0a7283eb4136491969b0497767972f1d28a' ]
```

And then it wouldn't continue.

The Problem
------------
For my issue, I had two paths set in my `TMP` variable on Windows. You can check your `npm` config with `npm config ls -l`. Here is the line that was giving me issues:

```bash
$ npm config ls -l
tmp = "C:\\Users\\gkent\\AppData\\Local\\Temp;C:\\ffmpeg\\bin"
```
Note the second path of `C:\\ffmpeg\\bin` separated by a `;`.

The Solution (For Windows)
------------
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