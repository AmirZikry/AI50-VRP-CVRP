import asyncio
import json
import sys
from pathlib import Path
import websockets

# Adjust this folder to match where your .vrp files are stored in your Python project
INSTANCES_DIR = Path(__file__).parent / "instances"
SARL_WS_URI = "ws://localhost:8765"


async def run_vrp_instance(instance_name: str):
    # Accept either a filename ("XML100_1111_01.vrp") or a full/relative path
    candidate = Path(instance_name)
    if not candidate.exists():
        candidate = INSTANCES_DIR / instance_name

    full_path = str(candidate.resolve())

    async with websockets.connect(SARL_WS_URI) as ws:
        await ws.send(full_path)
        raw_response = await ws.recv()

    data = json.loads(raw_response)

    if data.get("status") != "ok":
        print(f"Error from SARL: {data.get('message')}")
        return

    print("\n" + "=" * 50)
    print(f"INSTANCE: {candidate.name}")
    print("=" * 50)
    for r in data["routes"]:
        path_str = " ".join(r["path"])
        print(f"Route #{r['vehicle']}: {path_str}")
    print(f"Cost {data['total_cost']}")
    print("=" * 50 + "\n")


if __name__ == "__main__":
    # Run via: python sarl/multi-agent.py XML100_1111_02.vrp
    filename = sys.argv[1] if len(sys.argv) > 1 else "XML100_1111_01.vrp"
    file_to_run = f"../../DataCVRP/instances/{filename}"
    asyncio.run(run_vrp_instance(file_to_run))