---
title: "HTML Parsing With Beautiful Soup"
description: 'An example of using Beautiful Soup'
pubDate: '2007-10-15'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "programming"
  - "python"
---

**BEAUTIFUL SOUP IS** an HTML/XML parser written in Python. [Beautiful Soup](http://www.crummy.com/software/BeautifulSoup/ "Beautiful Soup") excels as an easy to use parser that requires no knowledge of actual parsing theory and techniques. And thanks to the [excellent documentation](http://www.crummy.com/software/BeautifulSoup/documentation.html "Beautiful Soup documentation") with many code examples, it is easy to fabricate some working code very quickly.

On Debian, Beautiful Soup can be install via _apt-get_ / _aptitude_: `aptitude install python-beautifulsoup`

The example below extracts the hit counter from this very page. Note that this is perhaps not the best example in the world (the only parse value used is the "footer" section), but it does exemplifies how easily the process of extracting data from a HTML page can be done when utilizing the Beautiful Soup parser.

```python
#!/usr/bin/env python
# coding=utf-8

from BeautifulSoup import BeautifulSoup          # For processing HTML
import urllib2                                   # URL tools
import re                                        # Regular expressions

def FindHits(proxyUrl):
    # URL to HTML parse
    url = 'http://monzool.net/blog/index.php'

    if len(proxyUrl) > 0:
        # Proxy set up
        proxy = urllib2.ProxyHandler( {'http': proxyUrl} )

        # Create an URL opener utilizing proxy
        opener = urllib2.build_opener( proxy )
        urllib2.install_opener( opener )

        # Aquire data from URL
        request = urllib2.Request( url )
        response = urllib2.urlopen( request )
    else:
        # Aquire data from URL
        response = urllib2.urlopen( url )

    # Extract data as HTML data
    html = response.read()

    # Parse HTML data
    soup = BeautifulSoup( html )

    # Search requested page for  section with id="footer"
    # (The result is returned in unicode)
    footer = soup.findAll( 'div', id="footer" )

    # Hint: on this site, it is known that only a single "footer" section
    # exists, and that the hit counter resides in that same section

    # Search for the frase "Hits="
    pattern = re.compile( r'Hits=.*[0-9]' )
    items = re.findall( pattern, str(footer[0]) )

    # Print result
    print items[0]        # -> "Hits="

if __name__ == "__main__":
    print "Processing..."
    FindHits("")          # Supply proxy if required.
                          # FindHist("http://:")


```

Explanation: If connecting to the internet through a proxy, some additional setup must be done to [urllib2](http://www.voidspace.org.uk/python/articles/urllib2.shtml "urlib2 tutorial"). Although urllib2 do provide some automatic proxy configuration detection, but here the configuration is made explicitly.

When the URL is opened the HTML is feed to the Beautiful Soup parser. Here after the member call `findAll` is used for finding the HTML div section identified as "footer" (

). As noted, no further parsing is done, as this page on contains only one footer section, but otherwise Beautiful Soup provides functions like `findAllNext` and `findNextSiblings` to iterate through the parse tree (Beautiful Soup is unicode aware, but not using it in this example, so converting the found section to ascii before inputting it to `findall`).

The resulting output from the search is the hit counter is extracted from this page.
