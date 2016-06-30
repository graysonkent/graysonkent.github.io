---
layout: post
title:  "Solving ruby!"
date:   2016-06-30 11:34:25 -0400
categories: ruby help errors
---


sudo gem install --http-proxy <host address>:<port> json

Building native extensions.  This could take a while...
ERROR:  Error installing json:
        ERROR: Failed to build gem native extension.

/usr/bin/ruby extconf.rb
mkmf.rb can't find header files for ruby at /usr/lib/ruby/ruby.h

Gem files will remain installed in /usr/lib64/ruby/gems/1.8/gems/json-1.8.1 for inspection.
Results logged to /usr/lib64/ruby/gems/1.8/gems/json-1.8.1/ext/json/ext/generator/gem_make.out



sudo apt-get install ruby-dev