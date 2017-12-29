---
layout: post
date: 2017-02-25 22:00
title:  "Using Amazon SES to abuse Vanity Email Addresses"
category: blogs
tags: AWS
redirect_from:
  - /archive/2017/02/how-to-use-amazon-ses-to-abuse-vanity-email-addresses.html
---

A Vanity Email Forwarding service address is one that that gives you an email address (you@desirabledomain.com) and lets you forward it to your personal email. See my email address for an example.

This is great for receiving emails, but what about sending from that domain? These domains don’t typically allow SMTP access for outgoing mail so they are kind of useless as personal email addresses. I didn't like that, so here is my solution:

Setup Amazon SES
----------------
1.  Setup an AWS account if you don't already have one at [aws.amazon.com/free‎](https://aws.amazon.com/free)

2. Login into the Simple Email Service (SES) console at [aws.amazon.com/ses/](https://aws.amazon.com/ses/)

3. Navigate within the console to SES Home > Identity Management > Email Addresses

4. You need to send a test verify email to at least your personal address that your vanity email is going to, and the vanity email address itself

5. Once those are verified, navigate back to SES Home > Email Sending > SMTP Settings

6. Copy down the Server Name field and then click "Create my SMTP Credentials"

7. This will go through the IAM process and will spit out the SMTP Credentials at the end. **Make sure to save these as they will not be accessible in AWS again**

8. Now, you can setup your inbox and be good, but you can only send to "verified" email addresses from Step 4 and that isn't fun

9. You have to apply to get out of "sandbox" mode by opening a support ticket with the "Regarding" field as "Service Limit Increase" and limit type of "SES Sending Limits"

I put in for a 400/day quota and got 50,000/day so they obviously aren't too worried about traffic.

Setup Gmail inbox
-----------------
While that request is pending (took me about a day), setup your inbox. This section is devoted to Gmail because that is what I use, but it would be similar for any other

1. Login into your account that the Vanity Email is going to (I made a new one for this specifically) and navigate to Settings > Accounts and Imports > Send Mail As > Click "Add another email address"

2. Put your Name and the Vanity Email Address and click "Treat as Alias"

3. Input the Server Name from Step 6 of the previous section and the SMTP user/password that you *hopefully* saved

4. Set the connection to port 587 using TLS if that isn't already the default

5. Let it run the checks and then input the code you got emailed, or click the link in it

Now you are good! If you have gotten approved for the increase from Amazon SES, then you can email anyone. You can even set the Vanity Address as the default send address and just truly take over the host Gmail account.

Q&A
---

**Why do emails from me say "sent via amazonses.com" next to my name in some email boxes?**
> 
> You have to setup, verify, and enable DKIM for the domain in SES to
> get rid of this. It is unlikely that you can convince the Vanity Email
> Address Providers to go for this, so you just have to live with this
> one. Plus it adds to your air of mystique.

**What do I do if I got denied for a service increase?** 
> Amazon SES isn't the only SMTP relay service out there, it is 
> just the one I know well. There are many more, just make 
> sure to check their policy on DKIM.

**Why can't I just use Gmail's SMTP servers?**

> Because in 2014 they decided that they valued trivial things like
> "security" and "authentication" /s. Oh, and they realized that they
> could charge for it as a business apps service.
