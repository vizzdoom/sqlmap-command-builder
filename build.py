import datetime
import pytz

def read_text(path):
    with open(path) as file:
        return file.read()


def inline_assets(html, css, js):
    compilation_time =  datetime.datetime.now().astimezone(pytz.timezone('Europe/Warsaw')).strftime("%Y-%m-%d %H:%M")
    html = html.replace(f'<span id="tool-version"></span>', f'<span id="tool-version">compiled on {compilation_time}<strong></strong></span>')
    html = html.replace(f'<link rel="stylesheet" href="style.css">', f'')
    html = html.replace(f'</head>', f'<style>\n{css}\n</style>\n</head>')
    html = html.replace(f'<script src="app.js"></script>', f'')
    html = html.replace(f'</body>', f'<script>\n{js}\n</script>\n</body>')
    return html


if __name__ == "__main__":
    html = read_text('index.html')
    css = read_text('style.css')
    js = read_text('app.js')

    with open('index.html', 'w') as output:
        output.write(inline_assets(html, css, js))
