---
layout: post
date: 2017-05-03 21:00
title:  "Error: Could not find gradle wrapper within android sdk."
category: blog
tags: Ionic
---
I got this error today why trying to build for Android using Ionic:

```terminal
> ionic build android
ANDROID_HOME=C:\Users\gkent\AppData\Local\Android\sdk

JAVA_HOME=C:\Program Files\Java\jdk1.8.0_131

Error: Could not find gradle wrapper within Android SDK. Might need to update your Android SDK.
Looked here: C:\Users\gkent\AppData\Local\Android\sdk\tools\templates\gradle\wrapper
```

This was weird as I knew my path was right and my Android SDK is up-to-date. You can check in **Android Studio -> Settings -> System Settings -> Updates -> Check for updates**.

How I fixed it
----
Download a standalone of the [SDK Tools Package](https://dl.google.com/android/repository/tools_r25.2.3-windows.zip) from Google. 

Extract it and grab the `Templates` directory. Place it in your `ANDROID_HOME` path under `tools`.

Your `ANDROID_HOME` path should have been specified in the error message, but if not here is how to find it:

Windows: `echo %ANDROID_HOME%`

Linux/Mac: `echo $ANDROID_HOME`