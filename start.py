import subprocess
import sys
import re
import os

def generate_env():
    filename = "get_tickets.py"
    if not os.path.exists(filename):
        print(f"Error: {filename} not found.")
        return

    with open(filename, "r") as f:
        content = f.read()

    client_id = re.search(r"client_id=['\"]([^'\"]+)['\"]", content)
    client_secret = re.search(r"client_secret=['\"]([^'\"]+)['\"]", content)

    if client_id and client_secret:
        env_content = (
            f"AMADEUS_API_KEY='{client_id.group(1)}'\n"
            f"AMADEUS_API_SECRET='{client_secret.group(1)}'\n"
        )
        with open(".env.local", "w") as env_file:
            env_file.write(env_content)
        print("Success: .env.local generated.")
    else:
        print("Error: Could not find keys")

def list_docker_images():
    print("\n--- Local Docker Images ---")
    subprocess.run(["docker", "images"])

def manage_docker():
    while True:
        print("\nIf issues make sure docker desktop is running, and you have a .env.local\n[1] Start (docker compose up):\n[2] Stop (docker compose down):\n[3] Build (docker compose up --build)\n[4] View logs (docker compose logs -f \"service-name\"):\n[5] List Images (docker images):\n[6] Generate .env.local\n[7] Exit")
        choice = input("Select an option: ")

        if choice == '1':
            print("To see logs in a new terminal run, \"docker compose logs -f backend\" or frontend")
            subprocess.run(["docker", "compose", "up","-d"])
        elif choice == '2':
            subprocess.run(["docker", "compose", "down"])
        elif choice == '3':
            print("To see logs in a new terminal run, \"docker compose logs -f backend\" or frontend")
            subprocess.run(["docker", "compose", "up", "--build","-d"])
        elif choice == '4':
            service = input("Enter service name (backend, frontend): ")
            subprocess.call(["docker", "compose", "logs", "-f", service])
        elif choice == '5':
            list_docker_images()
        elif choice == '6':
            generate_env()
        elif choice == '7':
            sys.exit()
        else:
            print("Invalid selection.")

if __name__ == "__main__":
    manage_docker()