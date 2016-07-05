var hostname = "/blog";
var index = lunr(function () {
    this.field('title')
    this.field('content', {boost: 10})
    this.field('category')
    this.field('tags')
    this.ref('id')
});



    index.add({
      title: "How to Insert Multiple Lines in Word",
      category: ["word"],
      content: "The Problem\nAn issue arose at work where we had 300 documents where we needed to replace a line with 2 lines of text. Normally I would use sed+regex to knock that out quickly, but since they were Word files it gets a little trickier.\n\nThe Solution\nUsing Word’s Find and Replace feature, replace the target line with your new lines separated by ^p and turn on wildcard matching.\n\nExample:\n\n\nSimple, but it took me a while to find an answer\n",
      tags: ["word","replace","regex"],
      id: 0
    });
    

    index.add({
      title: "Stopping Cisco IOS Domain Name Translation",
      category: ["errors","cisco"],
      content: "I often switch between Cisco IOS and Bash so I absent-mindedly type ‘ls’ into a IOS prompt and have to wait 30 seconds on this error:\n\nrouter#ls\nTranslating \"ls\"...domain server (255.255.255.255)\n% Unknown command or computer name, or unable to find computer address\n\nTo stop this, you can just press ‘CTRL+Shift+6’. But for more long-term fixes, see the options below:\n\nOption 1:\nStop router from starting connection without telnet keyword:\n\nrouter(config)#ip domain lookup\n\nrouter(config-line)#line con 0\n\nrouter(config-line)#transport preferred none\n\nOption 2:\nShorten TCP Connection Timeout:\n\nrouter(config)#ip tcp synwait-time 10\n\nThis isn’t preferable as it can affect things like handshakes for Multicast/BGP\n\nOption 3:\nDisable Domain Lookup:\n\nrouter(config)#no ip domain lookup\n\nI hesitate to recommend this one, though as it might affect the 1% of sites that need it. You can also disable per session Domain Lookup like so:\n\n#terminal no domain-lookup\n\n",
      tags: ["cisco","errors","lookup"],
      id: 1
    });
    

    index.add({
      title: "Fixing Ruby Header File Error",
      category: ["errors","ruby"],
      content: "While building out this site, I ran into a Ruby error I hadn’t seen before\n\n1\n2\n3\n4\n5\n6\n7Building native extensions.  This could take a while...\nERROR:  Error installing json:\n        ERROR: Failed to build gem native extension.\n\n/usr/bin/ruby extconf.rb\nmkmf.rb can't find header files for ruby at \n/usr/lib/ruby/ruby.h\n\n\nThis is solved by just installing ruby-dev like so:\n\n1sudo apt-get install ruby-dev\n\n\n",
      tags: ["ruby","errors","headers"],
      id: 2
    });
    


var store = [{
    "title": "How to Insert Multiple Lines in Word",
    "link": "/07-05-2016/how-to-insert-multiple-lines-in-words-find-and-replace.html",
    "image": null,
    "date": "July 5, 2016",
    "category": ["word"],
    "excerpt": "The Problem An issue arose at work where we had 300 documents where we needed to replace a line with..."
},{
    "title": "Stopping Cisco IOS Domain Name Translation",
    "link": "/07-01-2016/stopping-cisco-domain-name-translation.html",
    "image": null,
    "date": "July 1, 2016",
    "category": ["errors","cisco"],
    "excerpt": "I often switch between Cisco IOS and Bash so I absent-mindedly type ‘ls’ into a IOS prompt and have to..."
},{
    "title": "Fixing Ruby Header File Error",
    "link": "/07-01-2016/fixing-ruby-header-file-errors.html",
    "image": null,
    "date": "July 1, 2016",
    "category": ["errors","ruby"],
    "excerpt": "While building out this site, I ran into a Ruby error I hadn’t seen before 1 2 3 4 5..."
}]

$(document).ready(function() {
    $('#search-input').on('keyup', function () {
        var resultdiv = $('#results-container');
        if (!resultdiv.is(':visible'))
            resultdiv.show();
        var query = $(this).val();
        var result = index.search(query);
        resultdiv.empty();
        $('.show-results-count').text(result.length + ' Results');
        for (var item in result) {
            var ref = result[item].ref;
            var searchitem = '<li><a href="'+ hostname + store[ref].link+'">'+store[ref].title+'</a></li>';
            resultdiv.append(searchitem);
        }
    });
});