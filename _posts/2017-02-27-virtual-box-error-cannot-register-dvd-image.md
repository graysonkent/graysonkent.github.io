---
layout: post
date: 2017-02-26 22:00
title:  "VirtualBox Error: Cannot register the image because the UUID already exists"
category: blog
tags: Virtualization
redirect_from:
  - /archive/2017/02/virtual-box-error-cannot-register-dvd-image.html
---
This is an error I ran into in VirtualBox. Here is the full error code:

> Failed to open virtual machine located in F:/VMs/GNS3 WorkBench/GNS3 WorkBench.vbox.   
> Cannot register the DVD image  
> 'C:\Program Files\Oracle\VirtualBox\VBoxGuestAdditions.iso'  
> {29e469b5-852d-4364-b6fa-53f47dddb305} because a CD/DVD image
> 'C:\Program Files\Oracle\VirtualBox\VBoxGuestAdditions.iso' with UUID   
> {15684b2d-b6c1-4826-8a98-8619739dc681} already exists.  
> Result Code: E_INVALIDARG (0x80070057)   
> Component: VirtualBoxWrap Interface:  
> IVirtualBox {0169423f-46b4-cde9-91af-1e9d5b6cd945}

Obviously the filenames and UUIDs will be different for you, but that doesn't matter. In my case the issue was that multiple VMs were using the VBox Guest tools iso and it locked and corrupted one VM.

Here is how to fix it:

Option 1: From the VirtualBox Manager
-------------------------------------

This is the easiest way if VirtualBox will even let you open the Manager. Mine would error out too much to manipulate anything

1. Right Click and select "Settings" on the VM it is throwing the error about

2. Navigate to the Storage option and Right Click on the iso and select "Remove Attachment"

You should now at least be able to start the VM properly and figure out which one you want to give the iso to.

Option 2: Manually edit the .vbox file
--------------------------------------

1. Close all running VMs and VirtualBox Managers. Your changes will be not be written otherwise

2. Navigate to the folder that the offending VM is stored in. Typically `C:\Users\username\VirtualBox VMs` unless you manually changed it for Vagrant or portable use

3. Edit the file `VMname.vbox` where `VMname` is the name of your VM. Also, it is typically a blue icon on Windows

4. Delete everything inside the `DVDImages` tag, located under the XML tree of `VirtualBox > Machine > MediaRegistry > DVDImages`. It should be just `<DVDImages></DVDImages>` after this

5. Save the file and start the VirtualBox Manager

Enjoy your VM again!


