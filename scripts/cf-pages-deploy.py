#!/usr/bin/env python3
"""Deploy dist/ to Cloudflare Pages via direct upload API."""
import os, hashlib, base64, base64, json, sys
import urllib.request

TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN", "")
ACCOUNT = "739662d55565e46fcf6c0ed59f1cd934"
PROJECT = "wearesilicon-top"
DIST_DIR = "/Users/tommybai/workspace-silicon/site/dist"

def hash_file(data):
    h = hashlib.sha256(data).digest()
    return base64.b64encode(h).decode().rstrip('=')

def api_upload(url_path, data_payload):
    url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT}{url_path}"
    headers = {
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json"
    }
    body = json.dumps(data_payload).encode()
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        return {"success": False, "errors": json.loads(e.read())}

# Step 1: Create deployment session
print("Creating deployment session...")
result = api_upload(f"/pages/projects/{PROJECT}/deployments", {})
if not result.get("success"):
    print("Error:", result.get("errors"))
    sys.exit(1)

dep = result["result"]
dep_id = dep["id"]
print(f"Deployment ID: {dep_id}")

# Step 2: Upload files and build manifest
manifest = {}
uploaded = 0
skipped = 0

for root, dirs, files in os.walk(DIST_DIR):
    for filename in files:
        filepath = os.path.join(root, filename)
        rel_path = os.path.relpath(filepath, DIST_DIR)
        
        if rel_path.startswith('.'):
            continue
            
        with open(filepath, 'rb') as f:
            content = f.read()
        
        digest = hash_file(content)
        size = len(content)
        manifest[rel_path] = {"digest": digest, "size": size}
        
        # Upload file
        upload_resp = api_upload(
            f"/pages/projects/{PROJECT}/deployments/{dep_id}/files",
            {"data": base64.b64encode(content).decode(), "encoding": "base64"}
        )
        
        if upload_resp.get("success"):
            uploaded += 1
            if uploaded <= 10 or uploaded % 20 == 0:
                print(f"  ✓ {rel_path} ({size//1024}KB)")
        else:
            print(f"  ✗ {rel_path}")

print(f"\nUploaded {uploaded} files")

# Step 3: Trigger deployment with manifest
print("Finalizing deployment...")
final = api_upload(f"/pages/projects/{PROJECT}/deployments/{dep_id}", {"manifest": manifest})
if final.get("success"):
    d = final["result"]
    env = d.get("environment", "unknown")
    url = d.get("url", f"https://{PROJECT}.pages.dev")
    print(f"\n✅ Deployment complete!")
    print(f"   URL: {url}")
    print(f"   Environment: {env}")
else:
    print("Error:", final.get("errors"))
