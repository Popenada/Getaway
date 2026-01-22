# Dockerfile
#to build, run "docker compose build"

FROM python:3

# Set Working Directory
WORKDIR /workspace

# set environment variables
ENV FLASK_APP=getaway.py

# Install packages
COPY requirements.txt ./

RUN pip install --no-cache-dir --upgrade pip \
  && pip install --no-cache-dir -r requirements.txt

CMD flask run --port 8000