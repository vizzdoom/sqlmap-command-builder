def read_text(path):
    with open(path) as file:
        return file.read()


def inline_assets(html, css, js):
    page = html.replace('<link rel="stylesheet" href="style.css">', '')
    page = page.replace('</head>', f'<style>\n{css}\n</style>\n</head>')
    page = page.replace('<script src="app.js"></script>', '')
    return page.replace('</body>', f'<script>\n{js}\n</script>\n</body>')


if __name__ == "__main__":
    html = read_text('index.html')
    css = read_text('style.css')
    js = read_text('app.js')

    with open('index.html', 'w') as output:
        output.write(inline_assets(html, css, js))
