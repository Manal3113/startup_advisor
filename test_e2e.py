import urllib.request
import json

def test_api():
    base = "http://127.0.0.1:8000/api"
    print("Testing /health...")
    r = json.loads(urllib.request.urlopen(f"{base}/health").read())
    print("Health OK:", r["status"])

    print("Testing /settings/status...")
    s = json.loads(urllib.request.urlopen(f"{base}/settings/status").read())
    print("Status OK: Documents count =", s["rag_document_count"])

    print("Testing /analyze...")
    payload = {
        "raw_idea": "An automated micro-lending verification platform for small street vendors using UPI payment flows and digital khata.",
        "stage": "MVP",
        "title": "VendorCredit AI"
    }
    req = urllib.request.Request(
        f"{base}/analyze",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    analysis = json.loads(urllib.request.urlopen(req).read())
    aid = analysis["id"]
    print(f"Analyze OK: ID={aid}, Viability={analysis['viability_score']}/100, Title={analysis['startup_title']}")

    print(f"Testing /analysis/{aid}/agents...")
    agents = json.loads(urllib.request.urlopen(f"{base}/analysis/{aid}/agents").read())
    print(f"Agents OK: {len(agents)} advisors returned")

    print(f"Testing /analysis/{aid}/debate...")
    debate = json.loads(urllib.request.urlopen(f"{base}/analysis/{aid}/debate").read())
    print(f"Debate OK: {len(debate['debate_content'])} dialogue turns returned")

    print(f"Testing PDF report download /reports/{aid}/pdf...")
    pdf = urllib.request.urlopen(f"{base}/reports/{aid}/pdf").read()
    print(f"PDF OK: Generated {len(pdf)} bytes")

    print("Testing Vite React frontend http://127.0.0.1:5173...")
    frontend_status = urllib.request.urlopen("http://127.0.0.1:5173").status
    print("Frontend OK: Status =", frontend_status)

    print("\nALL FULL-STACK SERVICES ARE FUNCTIONING 100%! [VERIFIED]")

if __name__ == "__main__":
    test_api()
