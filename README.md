# SQLMap Command Builder

**Take control of SQLMap with a single page app.** This interactive builder lets you craft advanced [SQLMap](https://github.com/sqlmapproject/sqlmap) commands without memorising dozens of CLI switches. The whole project is pure HTML, CSS and JavaScript, so it works completely offline and keeps your tests private.

## Why is this tool handy?

- **Quick templates** – Start from built-in scenarios such as GET or POST tests and a Burp request import.
- **Full option coverage** – Toggle SQLMap's flags from clearly arranged tabs.
- **Tamper scripts** – Enable obfuscation techniques with a single click.
- **Save/Load configs** – Keep your favourite setups and share them easily.
- **Works offline** – Perfect for restricted environments or on‑site engagements.

Whether you are new to SQLMap or a seasoned operator, the builder saves you from endless command‑line tweaking and lets you focus on the actual test.

## Project website

<https://vizzdoom.github.io/sqlmap-command-builder/>

## Building

A Python helper script is provided to inline all assets and produce a single distributable `index.html` file. Run:

```bash
python3 build.py
```

The resulting file can be opened directly in your browser or served from any web server. The same built file is also deployed to the project's GitLab Pages.

## Usage

Open `index.html` and select the options you need. The generator will compose the appropriate SQLMap command line.

**Use responsibly — only test systems you have permission to audit.**

