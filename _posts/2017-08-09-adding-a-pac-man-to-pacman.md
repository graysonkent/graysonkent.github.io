---
layout: post
date: 2017-08-09 23:00
title:  "Adding an actual Pacman to the Pacman Package Manager"
category: blogs
tags: ['Arch Linux']
---
After recently switching over a few dozen dev tool servers to Arch Linux, I have embraced how amazing its package manager [Pacman](https://wiki.archlinux.org/index.php/pacman) really is. With Arch being a rolling release, it obviously needs to be very good at handling complex packaging situations and I haven't found anything it doesn't excel at yet.

The only thing I really want now was an actual [Pac-Man](https://en.wikipedia.org/wiki/Pac-Man) somewhere in it.

Of course, that is an option:

<p align="center">
    <video width="960" height="540" controls="controls">
        <source src="../assets/images/Pacman.mp4" type="video/mp4">
        <source src="../assets/images/Pacman.webm" type="video/webm">
    </video>
</p>

Notice the cute little yellow guy on the download progress bar section.

How to do it
-----------------

 1. Open your `/etc/pacman.conf`
 2. Add `ILoveCandy` under the `Misc Options` section
 3. Enjoy!