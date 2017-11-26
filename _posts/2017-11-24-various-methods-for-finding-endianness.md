---
layout: post
date: 2017-11-24 21:00
title:  "Various methods for determining CPU Endianness"
category: blogss
tags: Linux/Bash
---
In very simplified terms, a CPU's endianness refers to the order in which sequential bytes are stored. There are two main types, Big-Endian (most important part of sequence is stored first) and Little-Endian (most important part of sequence is stored last). The distinction is much less important nowadays though as the both Intel x86 and AMD64/x86-64 have converged on Little-Endian and they dominate the market.

For a more in-depth overview, check out [University of Maryland's Endian Notes Page](https://www.cs.umd.edu/class/sum2003/cmsc311/Notes/Data/endian.html). To go even lower, [you can dive into the wonderful micro-operation breakdown tables](https://web.archive.org/web/20170831203628/http://www.agner.org/optimize/instruction_tables.pdf) by Agner, although be prepared to cry over the waste that occurs between translating Big-Endian Network protocol bytestreams to mostly Little-Endian CPUs, and then back on every packet. It's only 1 clock cycle per word, but just imagine the colossal scale of these translations.

There are essentially two camps of thought when it comes to determining endianness: referencing a lookup table based on CPU name, and actually determining bit orientation on the fly by transforming a string. I am a purist at heart so I prefer the bit method, but you can decide what works better for your situation.

Od to Awk Method
----------------
This is probably the approach most people want to use for balanced portability vs. ease of use. Here is my modified version of [/u/slm](https://unix.stackexchange.com/users/7453/slm)'s script.

```bash
$ echo -n I | od -to2 | awk 'FNR==1{if (substr($2,6,1) == 1) print "Little-Endian"; else print "Big-Endian"}'
Little-Endian
``` 

It essentially converts a single letter ("I") to octal 2-byte units and then checks the byte order. An issue to this approach is that it doesn't detect types different than Little/Big-Endian, so you may want to skip down to my more complicated, portable solution below if you need that. 

### Breaking it down

```bash
echo -n I
```

Simple enough, `echo` outputs the letter "I" with no trailing newline.

```bash
| od -to2
```

Then, `od` translates "I" into octal 2-byte units with the `-o2` flag.

Here is what the current output looks like on my system:

```bash
$ echo -n I | od -to2
0000000 000111
0000001
```

We only care about the second column on the first line, where you can now see that my system is Little-Endian.

```bash
| awk 'FNR==1{if (substr($2,6,1) == 1) print "Little-Endian"; else print "Big-Endian"}'
```

Finally, `awk` examines the first line of output (`FNR==1`), and then looks at the second column (`$2` = `000111`) and the 6th character (`substr($2,6,1)`). If it is 1, then it outputs "Little-Endian". Everything else returns "Big-Endian".


Lscpu Method
------------
An arguably simpler method that works well with systems newer than 2012 uses `lscpu`'s output:

```bash
$ lscpu
Architecture:          x86_64
CPU op-mode(s):        32-bit, 64-bit
Byte Order:            Little Endian
CPU(s):                2
On-line CPU(s) list:   0,1
Thread(s) per core:    1
Core(s) per socket:    1
Socket(s):             2
NUMA node(s):          1
Vendor ID:             GenuineIntel
CPU family:            6
Model:                 63
Model name:            Intel(R) Xeon(R) CPU E5-2680 v3 @ 2.50GHz
Stepping:              2
CPU MHz:               2499.998
BogoMIPS:              4999.99
Hypervisor vendor:     VMware
Virtualization type:   full
L1d cache:             32K
L1i cache:             32K
L2 cache:              256K
L3 cache:              30720K
NUMA node0 CPU(s):     0,1
Flags:                 fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts mmx fxsr sse sse2 ss syscall nx pdpe1gb rdtscp lm constant_tsc arch_perfmon pebs bts nopl xtopology tsc_reliable nonstop_tsc aperfmperf pni pclmulqdq ssse3 fma cx16 pcid sse4_1 sse4_2 x2apic movbe popcnt aes xsave avx f16c rdrand hypervisor lahf_lm epb fsgsbase smep cqm_llc cqm_occup_llc dtherm ida arat pln pts
```

Obviously, this is just a sample output and we only care about the "Byte Order" section, so let's cut down the output some:

```bash
$ lscpu | sed -ne  's/^.*Byte Order:\s*//p'
Little Endian
```

This method works great if your version of [`util-linux`](https://www.kernel.org/pub/linux/utils/util-linux/) is [v2.19](https://www.kernel.org/pub/linux/utils/util-linux/v2.19/) or above (released Feb 2011). That was when they added the following section to [`/sys-utils/lscpu.c`](https://github.com/karelzak/util-linux/blob/aabe2441765c632bba697945491e3e0ac29ac886/sys-utils/lscpu.c#L821):

```c
#if !defined(WORDS_BIGENDIAN)
	print_s(_("Byte Order:"), "Little Endian");
#else
	print_s(_("Byte Order:"), "Big Endian");
#endif
```

Generally, any system past 2012 will have this package. If you have to live with your old system, then you can compile the new version of `util-linux` or move on to my more portable method below. 

### Breaking it down
The previous code section looks for [Autoconf](https://www.gnu.org/software/autoconf/autoconf.html)'s [`WORDS_BIGENDIAN`](http://gnu.huihoo.org/autoconf-2.13/html_node/autoconf_36.html) macro. Autoconf in turn tries to check your `sys/types.h` and `sys/param.h` to see if they define a `BYTE_ORDER` macro:

```c
[AC_LANG_PROGRAM(
   [[#include <sys/types.h>
     #include <sys/param.h>
   ]],
   [[#if ! (defined BYTE_ORDER && defined BIG_ENDIAN \
	     && defined LITTLE_ENDIAN && BYTE_ORDER && BIG_ENDIAN \
	     && LITTLE_ENDIAN)
      bogus endian macros
     #endif
	]]
)]
```

This is just the relevant snippet, but [`autoconf/lib/autoconf/c.m4`](https://ftp.gnu.org/gnu/autoconf/) actually goes on to check a lot more and is worth a read for anyone looking to write their own method.. 

> **Note:** Autoconf defines 4 types of endianness. Here is a snippet from `autoconf/test/semantics.at`:
> 
>     AC_C_BIGENDIAN(
>          [ac_endian=big],
>          [ac_endian=little],
>          [ac_endian=unknown],
>          [ac_endian=universal]
>     )

On my system, `/usr/include/sys/param.h` includes this line:

```c
/* Define BYTE_ORDER et al.  */
#include <endian.h>
```

Looking at `/usr/include/endian.h`, we get a nice writeup of byte order:

```c
/* Definitions for byte order, according to significance of bytes,
   from low addresses to high addresses.  The value is what you get by
   putting '4' in the most significant byte, '3' in the second most
   significant byte, '2' in the second least significant byte, and '1'
   in the least significant byte, and then writing down one digit for
   each byte, starting with the byte at the lowest address at the left,
   and proceeding to the byte with the highest address at the right.  */

#define __LITTLE_ENDIAN 1234
#define __BIG_ENDIAN    4321
#define __PDP_ENDIAN    3412
```

And the actually important part:

```c
/* This file defines `__BYTE_ORDER' for the particular machine.  */
#include <bits/endian.h>
```

Almost done, `/usr/include/bits/endian.h` is a small file containing this:

```c
/* i386/x86_64 are little-endian.  */

#ifndef _ENDIAN_H
# error "Never use <bits/endian.h> directly; include <endian.h> instead."
#endif

#define __BYTE_ORDER __LITTLE_ENDIAN
```

Alright, so now we have gone as far as I want to. If you are interested in learning more, [check out this gcc dev thread that covers a lot of the same issues in detecting endianness that I mention here](https://gcc.gnu.org/ml/gcc-help/2007-07/msg00342.html).

Dpkg Method
------------
If you are using Debian/Ubuntu, then this might be even easier to use:

```bash
$ dpkg-architecture -q DEB_BUILD_ARCH_ENDIAN
little
```

Endian variables were introduced in [`dpkg-dev 1.15.4`](https://manpages.debian.org/wheezy/dpkg-dev/dpkg-architecture.1.en.html), so this method has the same issue as the `lscpu` one. 

> **Note:** You can even set a list of options to match using the `-E` option:
> 
>     -E, --match-endian <arch-endian>
>                 restrict architecture list matching <arch-endian>.


### Breaking it down

Looking at `scripts/dpkg-architecture.pl` in the [`dpkg-dev`](https://packages.ubuntu.com/trusty/dpkg-dev) package, we get our first hint of how this works:

```perl
use Dpkg::Arch qw(get_raw_build_arch get_raw_host_arch get_gcc_host_gnu_type
                  debarch_to_cpuattrs
                  get_valid_arches debarch_eq debarch_is debarch_to_debtriplet
                  debarch_to_gnutriplet gnutriplet_to_debarch
                  debarch_to_multiarch);
```

So there is a `DPKG::Arch` module that handles the real details in `scripts/Dpkg/Arch.pm`:

```perl
sub read_cputable {
    return
        if ($cputable_loaded);

    local $_;
    local $ / = "\n";

    open my $cputable_fh, '<', "$Dpkg::DATADIR/cputable"
    or syserr(_g('cannot open %s'), 'cputable');
    while ( < $cputable_fh > ) {
        if (m / ^ ( ? !\#)(\S + )\ s + (\S + )\ s + (\S + )\ s + (\S + )\ s + (\S + ) / ) {
            $cputable {$1} = $2;
            $cputable_re {$1} = $3;
            $cpubits {$1} = $4;
            $cpuendian {$1} = $5;
            push@ cpu, $1;
        }
    }
    close $cputable_fh;

    $cputable_loaded = 1;
}
```

The important part to note here is that the `$cpuendian` is simply set by doing a regex lookup of the CPU type in the `cputable` file.

Here is an (edited) version of its lookup:

```bash
$ grep "^[^#;]" cputable | sort -k5 | awk '{print $1":"$5}'
armeb:big
avr32:big
hppa:big
m32r:big
m68k:big
mips64:big
mips:big
powerpc:big
ppc64:big
s390:big
s390x:big
sh3eb:big
sh4eb:big
sparc64:big
sparc:big
alpha:little
amd64:little
arm64:little
arm:little
i386:little
ia64:little
mips64el:little
mipsel:little
ppc64el:little
sh3:little
sh4:little
``` 

If you aren't too worried about precision, then this might be a good method to steal the lookup table from. 

Perl Config Method
------------------------

Segueing nicely from the last `perl` approach, we are instead going to use the core `Config` module. Here is my modified version of this lookup:

```perl
$ perl -MConfig -e 'if ($Config{byteorder} =~ /^1/) {print "Little-Endianness\n"} else {print "Big-Endianness\n"};'
Little-Endianness
```

You can read more about this valuable module on the [`Config Documentation Page`](https://perldoc.perl.org/Config.html#b).

### Breaking it down
I pulled the source for Sun's version of the `Config` module, just to spice things up some, but sadly it seems to follow the same pattern as `dpkg-architecture` in that it performs a lookup based on CPU type. 

We can see this easily here:

```bash
$ grep -r "byteorder='*'" . | sort -t= -k2
./config/5.00503/5.8/x86/Config.pm:byteorder='1234'
./config/5.00503/5.9/x86/Config.pm:byteorder='1234'
./config/5.006001/5.10/x86/Config.pm:byteorder='1234'
./config/5.006001/5.9/x86/Config.pm:byteorder='1234'
./config/5.00503/5.8/sparc/Config.pm:byteorder='4321'
./config/5.00503/5.9/sparc/Config.pm:byteorder='4321'
./config/5.006001/5.10/sparc/Config.pm:byteorder='4321'
./config/5.006001/5.9/sparc/Config.pm:byteorder='4321'
```

Notice how the `byteorder` variables are different depending on the folder they are in. This is usually a pretty good indication that a script will set the config path at build time. 

Sure enough, `Makefile.PL` sets the `$hw` variable:

```perl
my $hw = $arch;
$hw = 'x86' if ($hw eq 'i86pc');
$hw = 'sparc' if ($hw =~ /^sun4/);
``` 

And then defines the config path:

```perl
# Figure out the appropriate Config.pm and MakeMaker.pm
my $configpm = "config/$]/$rel/$hw/Config.pm";
```

Perl Unpacking Method
-----------------------
Modified from [my trusty ol' Camel book](https://docstore.mik.ua/orelly/perl3/prog/ch25_02.htm), here is another `perl` method:

```perl
$ perl -e 'if (unpack("h*", pack("s", 1)) =~ /^1/) {print "Little-Endian\n"} else {print "Big-Endian\n"};'
Little-Endian
```

This is similar to the `od` method above in that it just interprets the letter "I" in binary format and then checks the orientation of the bits.

Portable C Method
-----------------
This method claims to be the most portable way to test for endianness. It works on my platforms, but I also don't have Sparc/ARM platforms to test on so take that with a grain of salt.

Here is a modified version of [/u/panzi's](https://gist.github.com/panzi/6856583) program:

```c
#ifndef PORTABLE_ENDIAN_H__
#define PORTABLE_ENDIAN_H__

#if (defined(_WIN16) || defined(_WIN32) || defined(_WIN64)) && !defined(__WINDOWS__)

#	define __WINDOWS__

#endif

#if defined(__linux__) || defined(__CYGWIN__)

#	include <endian.h>

#elif defined(__APPLE__)

#	include <libkern/OSByteOrder.h>

#	define htobe16(x) OSSwapHostToBigInt16(x)
#	define htole16(x) OSSwapHostToLittleInt16(x)
#	define be16toh(x) OSSwapBigToHostInt16(x)
#	define le16toh(x) OSSwapLittleToHostInt16(x)
 
#	define htobe32(x) OSSwapHostToBigInt32(x)
#	define htole32(x) OSSwapHostToLittleInt32(x)
#	define be32toh(x) OSSwapBigToHostInt32(x)
#	define le32toh(x) OSSwapLittleToHostInt32(x)
 
#	define htobe64(x) OSSwapHostToBigInt64(x)
#	define htole64(x) OSSwapHostToLittleInt64(x)
#	define be64toh(x) OSSwapBigToHostInt64(x)
#	define le64toh(x) OSSwapLittleToHostInt64(x)

#	define __BYTE_ORDER    BYTE_ORDER
#	define __BIG_ENDIAN    BIG_ENDIAN
#	define __LITTLE_ENDIAN LITTLE_ENDIAN
#	define __PDP_ENDIAN    PDP_ENDIAN

#elif defined(__OpenBSD__)

#	include <sys/endian.h>

#elif defined(__NetBSD__) || defined(__FreeBSD__) || defined(__DragonFly__)

#	include <sys/endian.h>

#	define be16toh(x) betoh16(x)
#	define le16toh(x) letoh16(x)

#	define be32toh(x) betoh32(x)
#	define le32toh(x) letoh32(x)

#	define be64toh(x) betoh64(x)
#	define le64toh(x) letoh64(x)

#elif defined(__WINDOWS__)

#	include <winsock2.h>
#	include <sys/param.h>

#	if BYTE_ORDER == LITTLE_ENDIAN

#		define htobe16(x) htons(x)
#		define htole16(x) (x)
#		define be16toh(x) ntohs(x)
#		define le16toh(x) (x)
 
#		define htobe32(x) htonl(x)
#		define htole32(x) (x)
#		define be32toh(x) ntohl(x)
#		define le32toh(x) (x)
 
#		define htobe64(x) htonll(x)
#		define htole64(x) (x)
#		define be64toh(x) ntohll(x)
#		define le64toh(x) (x)

#	elif BYTE_ORDER == BIG_ENDIAN

		/* that would be xbox 360 */
#		define htobe16(x) (x)
#		define htole16(x) __builtin_bswap16(x)
#		define be16toh(x) (x)
#		define le16toh(x) __builtin_bswap16(x)
 
#		define htobe32(x) (x)
#		define htole32(x) __builtin_bswap32(x)
#		define be32toh(x) (x)
#		define le32toh(x) __builtin_bswap32(x)
 
#		define htobe64(x) (x)
#		define htole64(x) __builtin_bswap64(x)
#		define be64toh(x) (x)
#		define le64toh(x) __builtin_bswap64(x)

#	else

#		error byte order not supported

#	endif

#	define __BYTE_ORDER    BYTE_ORDER
#	define __BIG_ENDIAN    BIG_ENDIAN
#	define __LITTLE_ENDIAN LITTLE_ENDIAN
#	define __PDP_ENDIAN    PDP_ENDIAN

#elif defined(_NEWLIB_VERSION)

	/*
	 * GNU ARM toolchain, and possibly other bare-metal toolchains
	 * built on newlib.  Tested with
	 * (GNU Tools for ARM Embedded Processors 6-2017-q2-update
	 */

#	include <machine/endian.h>

#	if BYTE_ORDER == LITTLE_ENDIAN

#		define htobe16(x) __bswap16(x)
#		define htole16(x) (x)
#		define be16toh(x) __bswap16(x)
#		define le16toh(x) (x)

#		define htobe32(x) __bswap32(x)
#		define htole32(x) (x)
#		define be32toh(x) __bswap32(x)
#		define le32toh(x) (x)

#		define htobe64(x) __bswap64(x)
#		define htole64(x) (x)
#		define be64toh(x) __bswap64(x)
#		define le64toh(x) (x)

#	elif BYTE_ORDER == BIG_ENDIAN

#		define htobe16(x) (x)
#		define htole16(x) __bswap16(x)
#		define be16toh(x) (x)
#		define le16toh(x) __bswap16(x)

#		define htobe32(x) (x)
#		define htole32(x) __bswap32(x)
#		define be32toh(x) (x)
#		define le32toh(x) __bswap32(x)

#		define htobe64(x) (x)
#		define htole64(x) __bswap64(x)
#		define be64toh(x) (x)
#		define le64toh(x) __bswap64(x)

#	else

#		error byte order not supported

#	endif

#else

#	error platform not supported

#endif

#endif
```

Pretty simple all-around. I would be interested to see how it does on other platforms though.

Conclusion
---------------
This is probably more than any sane person would want to know about CPU endianness, but I still think it is an interesting topic. 

If you want to contribute another method, please email it to me with the name you want for attribution.
