import datetime

def read_text(path):
    with open(path) as file:
        return file.read()


def inline_assets(html, css, js):
    compilation_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    html = html.replace(f'<span id="tool-version"></span>', '<span id="tool-version">compiled on {compilation_time}<strong></strong></span>')
    html = html.replace('<link rel="stylesheet" href="style.css">', '')
    html = html.replace('</head>', f'<style>\n{css}\n</style>\n</head>')
    html = html.replace('<script src="app.js"></script>', '')
    html = html.replace('</body>', f'<script>\n{js}\n</script>\n</body>')
    return html


if __name__ == "__main__":
    html = read_text('index.html')
    css = read_text('style.css')
    js = read_text('app.js')

    with open('index.html', 'w') as output:
        output.write(inline_assets(html, css, js))
