import datetime
import pytz
import base64


def read_text(path):
    with open(path) as file:
        return file.read()


def compile_assets(html, css, js):
    compilation_time = datetime.datetime.now().astimezone(pytz.timezone('Europe/Warsaw')).strftime("%Y-%m-%d %H:%M")
    img_background = f'background: url("data:image/jpeg;base64,{base64.b64encode(open("background.jpg", "rb").read()).decode()}");'
    css = css.replace(f"  background: url('background.jpg');", img_background)
    html = html.replace(f'<span id="tool-version"></span>', f'<span id="tool-version">compiled on <strong>{compilation_time}</strong></span>')
    html = html.replace(f'<link rel="stylesheet" href="style.css">', f'')
    html = html.replace(f'</head>', f'<style>\n{css}\n</style>\n</head>')
    html = html.replace(f'<script src="app.js"></script>', f'')
    html = html.replace(f'</body>', f'<script>\n{js}\n</script>\n</body>')
    return html


if __name__ == "__main__":
    html = read_text('sql-command-builder.html')
    css = read_text('style.css')
    js = read_text('app.js')
    html_final = 'index.html'

    with open('index.html', 'w') as output:
        output.write(compile_assets(html, css, js))
