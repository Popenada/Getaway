import subprocess

def run_cmd(cmd):
    return subprocess.check_output(cmd).decode("utf-8").strip()

def sync_docker():
    try:
        branch = run_cmd(["git", "rev-parse", "--abbrev-ref", "HEAD"])
        print(f"Detected branch: {branch}")

        print(f"Pulling latest image for {branch}...")
        subprocess.run(["docker", "compose", "pull"], check=True)

        print("Starting services in detached mode...")
        subprocess.run(["docker", "compose", "up", "-d"], check=True)
        
        print("Sync complete!")

    except subprocess.CalledProcessError as e:
        print(f"Error occurred: {e}")

if __name__ == "__main__":
    sync_docker()