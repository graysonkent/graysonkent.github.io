---
layout: post
date: 2025-06-01 23:00
title:  "Exporting iDRAC TSR logs on RHEL9"
category: blogs
tags: Linux/Bash
---
Recently ran into a issue at work where we needed iDRAC TSR logs for Dell warranty service and getting the `racadm` command working had conflicting and scattered information online so here is a quick start guide of what worked for me on RHEL9.

Add the Dell Repo
-----------------
Create repo file:
```bash
touch /etc/yum.repos.d/dell.repo
```
And set content to:

```bash
[dell]
name=Dell iDRAC utility repository
baseurl=https://linux.dell.com/repo/hardware/DSU_22.05.27/os_dependent/RHEL8_64/
enabled=1
gpgcheck=0
```
> **Note:** The RHEL9_64 directory doesn't exist as of the time of this post

Install the server tools:
```bash
sudo yum install srvadmin-all -y
```

Setup racadm
------------
Once installed you may need to add the Dell directory to your path:

```bash
echo 'export PATH=$PATH:/opt/dell/srvadmin/bin' >> ~/.bashrc && source ~/.bashrc
```

Run racadm
----------
Start a job to collect TSR logs:
```bash
idracadm7 techsupreport collect -t sysinfo,ttylog | awk '/^JID_/ {print $3}'
```
Using the Job ID from the first command you can check on the progress:
```bash
racadm jobqueue view -i JID_XXXXXXX
```
When finished, export the logs to send to Dell:
```bash
idracadm7 techsupreport export -f /tmp/tsrlogs.zip
```
