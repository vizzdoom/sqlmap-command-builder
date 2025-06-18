# SQLMap Command Builder

**Take control of SQLMap with a single page app.** This interactive builder lets you craft advanced [SQLMap](https://github.com/sqlmapproject/sqlmap) commands without memorising dozens of CLI switches. 

Thewhole project is pure HTML, CSS and JavaScript, so it works completely offline to keeps your tests private.

This command builder saves you from endless command‑line tweaking and lets you focus on the actual penetration test.

## Project website

<https://vizzdoom.github.io/sqlmap-command-builder/>
(this page source code can be saved and opened locally)

## Building

A Python helper script is provided to inline all assets and produce a single distributable `index.html` file. Run:

```bash
python3 build.py
```

The resulting file can be opened directly in your browser or served from any web server. The same built file is also deployed to the project's GitLab Pages.

## Usage

Open `index.html` and select the options you need. The generator will compose the appropriate SQLMap command line.

**Use responsibly — only test systems you have permission to audit.**

