---
title: "WP-Syntax and GeShi Color Tweaking"
description: ''
pubDate: '2007-09-01'
heroImage: '../../assets/fallback-blossom-blue.jpg'
categories:
  - "programming"
  - "web"
---

**SOURCE CODE COLORING** in WordPress is thankfully a pretty simple task, thanks to the WordPress plugin system. This allows for installing filters to do the coloring and formatting automatic. Several plugins exists for WordPress to do source code coloring, but (for now?) I've settled on the [Wp-Syntax](http://wordpress.org/extend/plugins/wp-syntax/ "Wp-Syntax") plugin. Not that its necessary better that the other options, but it does a pretty fine job, and I like the layout it presents.

However the default coloring scheme in Wp-Syntax is not to my taste, so I had to do some tweaking. Wp-Syntax uses the popular [GeShi](qbnz.com/highlighter/ "GeSHi - Generic Syntax Highlighter") Highlighter as backend, and GeShi is highly customizable.

Wp-Syntax splits the source area on two columns with one optional column for line numbering and one for the source code. The formatting of the line numbering column and the boxes surrounding both columns are both configured separate from GeShi. The only thing required to style the non-GeShi things is to apply the desired formatting in the main css file (note that the Wp-Syntax css may override the GeShi css, e.g. color). All classes are documented on the Wp-Syntax notes page. Below is a snippet from this site configuration.

```css
.wp_syntax {
  color: #404040;
  background-color: #F9F9F9;
  border: 1px solid silver;
  overflow: auto;
  margin-top: 10px;
  margin-bottom: 10px;
}

.wp_syntax .line_numbers {
  text-align: right;
  background-color: #46555D;
  color: orange;
  overflow: visible;
}

```

The GeShi part that formats the actual source code, requires a few more simple steps. The [Wp-Syntax notes page](http://wordpress.org/extend/plugins/wp-syntax/other_notes/ "Wp-Syntax notes"), explains how to modify changes to the default GeShi color settings. I don't find the method descriped that optimal. I would rather configure the coloring in sites css file. The steps required for this is described in the [GeShi documentation](http://qbnz.com/highlighter/geshi-doc.html#using-css-classes "GeShi Using css Classes"). First step is to enable the use of css classes. The documentation states that this should be enabled right after instantiation of the GeShi object. This can be done by adding lines 2 and 3 in the Wp-Syntax file `wp-syntax.php`.

```php
    $geshi = new GeSHi($code, $language);
    $geshi->enable_classes();
    $geshi->get_stylesheet();
    $geshi->enable_keyword_links(false);

```

Remaining is the actual css contents for defining the colors. Here the team behind GeShi excell by supplying a php script for generating the css code. If downloading the GeShi source the script is available as `/geshi/contrib/cssgen.php`. Following the three easy steps in the script generates the css ready to paste in the main css file.

Thats it! Colors tweaked.
