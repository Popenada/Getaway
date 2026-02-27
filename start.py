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

    # Extracting IDs using Regex
    client_id = re.search(r"client_id=['\"]([^'\"]+)['\"]", content)
    client_secret = re.search(r"client_secret=['\"]([^'\"]+)['\"]", content)

    if client_id and client_secret:
        env_content = (
            f"AMADEUS_API_KEY='{client_id.group(1)}'\n"
            f"AMADEUS_API_SECRET='{client_secret.group(1)}'\n"
        )
        with open(".env.local", "w") as env_file:
            env_file.write(env_content)
        print("Success: .env.local generated with Amadeus credentials.")
    else:
        print("Error: Could not find client_id or client_secret in the file.")

def manage_docker():
    while True:
        print("\n[1] Start (docker compose up)\n[2] Build (docker compose up --build)\n[3] Stop (docker compose down)\n[4] view logs (docker compose logs -f <service>)\n[5] generate .env.local\n[6] exit")
        choice = input("Select an option: ")

        if choice == '1':
            subprocess.run(["docker", "compose", "up", "-d"])
        elif choice == '2':
            subprocess.run(["docker", "compose", "up", "--build", "-d"])
        elif choice == '3':
            subprocess.run(["docker", "compose", "down"])
        elif choice == '4':
            service = input("Enter service name: ")
            subprocess.call(["docker", "compose", "logs", "-f", service])
        elif choice == '5':
            generate_env()
        elif choice == '6':
            sys.exit()
        else:
            print("Invalid selection.")

if __name__ == "__main__":
    manage_docker()