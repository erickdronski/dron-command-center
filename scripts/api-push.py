#!/usr/bin/env python3
"""
Push public/data/ files to GitHub via REST API.
Used when git push fails due to SSL issues (LibreSSL bug).
"""
import base64, json, os, sys
import urllib.request, urllib.error

TOKEN = os.environ.get("GITHUB_TOKEN", "")
if not TOKEN:
    print("[api-push] GITHUB_TOKEN env var not set", file=sys.stderr)
    sys.exit(1)
REPO = "erickdronski/dron-command-center"
BRANCH = "main"
HEADERS = {
    "Authorization": f"token {TOKEN}",
    "Accept": "application/vnd.github+json",
    "Content-Type": "application/json",
    "User-Agent": "dron-command-center-sync"
}

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def gh_request(method, path, body=None):
    url = f"https://api.github.com{path}"
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(url, data=data, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        txt = e.read().decode()
        # 404 on GET = file doesn't exist yet, ok
        if e.code == 404 and method == "GET":
            return None
        print(f"[api-push] HTTP {e.code}: {txt}", file=sys.stderr)
        return None

def get_file_sha(remote_path):
    result = gh_request("GET", f"/repos/{REPO}/contents/{remote_path}?ref={BRANCH}")
    return result.get("sha") if result else None

def push_file(local_path, remote_path, message):
    if not os.path.exists(local_path):
        print(f"[api-push] SKIP {remote_path} (not found locally)", file=sys.stderr)
        return False
    with open(local_path, "rb") as f:
        content = base64.b64encode(f.read()).decode()
    sha = get_file_sha(remote_path)
    body = {"message": message, "content": content, "branch": BRANCH}
    if sha:
        body["sha"] = sha
    result = gh_request("PUT", f"/repos/{REPO}/contents/{remote_path}", body)
    if result:
        print(f"[api-push] ✓ {remote_path}")
        return True
    else:
        print(f"[api-push] ✗ {remote_path} FAILED", file=sys.stderr)
        return False

def main():
    data_dir = os.path.join(ROOT, "public", "data")
    if not os.path.isdir(data_dir):
        print(f"[api-push] data dir not found: {data_dir}", file=sys.stderr)
        sys.exit(1)

    files = [f for f in os.listdir(data_dir) if f.endswith(".json")]
    if not files:
        print("[api-push] no JSON files in public/data/")
        sys.exit(0)

    ts = __import__("datetime").datetime.now().strftime("%Y-%m-%d %H:%M")
    msg = f"data: sync {ts}"
    ok = True
    for fname in sorted(files):
        local = os.path.join(data_dir, fname)
        remote = f"public/data/{fname}"
        if not push_file(local, remote, msg):
            ok = False

    sys.exit(0 if ok else 1)

if __name__ == "__main__":
    main()
