# build.py
html = open('index.html').read()
css = open('style.css').read()
js = open('app.js').read()

# Zakładam, że index.html ma <head>...</head> i </body>
# Dodaj CSS do <head>
html = html.replace('<link rel="stylesheet" href="style.css">', '');

html = html.replace(
    '</head>',
    f'<style>\n{css}\n</style>\n</head>'
)
# Dodaj JS na końcu przed </body>
html = html.replace('<script src="app.js"></script>','');
html = html.replace(
    '</body>',
    f'<script>\n{js}\n</script>\n</body>'
)

with open('index.html', 'w') as f:
    f.write(html)
