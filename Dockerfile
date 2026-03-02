# Dockerfile

# python slim image
FROM python:3.14.3-slim

# working dir
WORKDIR /app

# save requirments for cache
COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip \
  && pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

# start the application
CMD ["python", "run.py"]