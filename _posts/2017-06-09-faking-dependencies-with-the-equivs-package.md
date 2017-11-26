---
layout: post
date: 2017-06-09 21:00
title:  "Faking dependencies with the equivs package"
category: blogs
tags: Linux/Bash
---
Let's say a package you are trying to install has a crazy list of dependencies that you know it doesn't need, or you don't want to/can't install for various reasons. Maybe you even have a newer version of package and you don't want to downgrade. How do you get everything running?

One way to get around these requirements is to create a dummy package using [`equivs`](https://packages.ubuntu.com/trusty/equivs).

Creating a dummy package
---------------------------------------

Install `equivs` via `sudo apt-get install -y equivs` or your package manager. Then use `equivs-control <packageToFake>` to create the control file that looks like this:

```bash
# Commented entries have reasonable defaults.
# Uncomment to edit them.
# Source: <source package name; defaults to package name> Section: misc Priority: optional
# Homepage: <enter URL here; no default> Standards-Version: 3.9.2

Package: <package name; defaults to equivs-dummy>
# Version: <enter version here; defaults to 1.0>
# Maintainer: Your Name <yourname@example.com>
# Pre-Depends: <comma-separated list of packages>
# Depends: <comma-separated list of packages>
# Recommends: <comma-separated list of packages>
# Suggests: <comma-separated list of packages>
# Provides: <comma-separated list of packages>
# Replaces: <comma-separated list of packages>
# Architecture: all
# Copyright: <copyright file; defaults to GPL2>
# Changelog: <changelog file; defaults to a generic changelog>
# Readme: <README.Debian file; defaults to a generic one>
# Extra-Files: <comma-separated list of additional files for the doc directory>
# Files: <pair of space-separated paths; First is file to include, second is destination>
#  <more pairs, if there's more than one file to include. Notice the starting space>

Description: <short description; defaults to some wise words>
   long description and info
   .
   second paragraph
```

Edit that file to only include the necessary info. Here is what I normally keep:

```bash
Section: misc
Priority: optional
Standards-Version: 3.9.2

Package: packagetofake
Version: 1:50
Maintainer: Your Name <yourname@example.com>
Provides: package-to-fake, another-package-to-fake
Architecture: all
Description: fake package
```

Please note that the Package name has to match what you are trying to replace, and the Version should be higher than the real package. The 1 in "1:50" refers to the [epoch number](http://www.fifi.org/doc/debian-policy/policy.html/ch-versions.html), which defaults to 0.

Now you just need to build the dummy package with `equivs-build packageToFake`. This will generate your `packagetofake_1.5_all.deb` which you can now install like normal with `dpkg -i`.