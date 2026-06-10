from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os


ROOT = Path(__file__).resolve().parents[1] / "dist"


class SpaHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        raw = path.split("?", 1)[0].split("#", 1)[0]
        translated = ROOT / raw.lstrip("/")
        if translated.is_file():
            return str(translated)
        return str(ROOT / "index.html")

    def log_message(self, format, *args):
        return


if __name__ == "__main__":
    os.chdir(ROOT)
    server = ThreadingHTTPServer(("127.0.0.1", 8080), SpaHandler)
    print("Daily Snapshot server running at http://127.0.0.1:8080/daily-snapshot", flush=True)
    server.serve_forever()
