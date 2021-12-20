---
title: "Jekyll: Render LaTeX in Markdown"
tags: jekyll latex markdown mathematics
---

Assumptions:

1. You want to write posts or pages in markdown for your Jekyll sites and have LaTeX equations and expressions render as mathematical symbols, rather than something like `$$\frac{1}{2}$$` .
2. The choice of mathematical typesetting library (MathJax/KaTeX) is immaterial to you, or you want to use MathJax.
3. You are using the *Minima* Jekyll theme.
4. You are using linux.

This is not the only way to include equations for rendering in markdown with Jekyll.  And the instructions may need to be modified per your specific circumstances anyway.

---

1. From the terminal, run `bundle show minima`.
2. This should display a path to a directory.  For me it was `/home/myUsername/gems/gems/minima-2.5.1/_layouts/`.  Navigate to this folder.
4. Copy `default.html`.
5. Navigate to the publishing source for your site (e.g. the `docs` folder).
6. Create a new directory named `_layouts`.  Notice that such a directory existed in the files for the *Minima* theme, but not in your publishing source. 
 1. Paste `default.html` in the newly created `_layouts` folder in your publishing source.
 2. Open `default.html` in a text editor and append the line `<script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML" type="text/javascript"></script>
` to the end of the file, then save and close it.
7. Change one of your posts or pages to include some LaTeX.  Note that instead of wrapping an expression in `$...$`, you will need to use `$$...$$` (even if your expression is inline).
8. From the terminal, navigate to your publishing source.  Test your site locally by running `bundle exec jekyll serve`.
9. In your browser, type `localhost:4000` into your address bar and press Enter.
10. Navigate to your post or page which you included some LaTeX in.  Hopefully you will now see mathematical symbols.

### Sources
https://talk.jekyllrb.com/t/how-to-use-latex-on-jekyll/4119

http://www.iangoodfellow.com/blog/jekyll/markdown/tex/2016/11/07/latex-in-markdown.html
