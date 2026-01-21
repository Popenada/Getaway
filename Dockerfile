# Dockerfile
#to build, run "docker build -t [name]/getaway:1 ."

FROM python:3

# Set Working Directory
WORKDIR /workspace

# Install packages
COPY requirements.txt ./

RUN pip install --no-cache-dir --upgrade pip \
  && pip install --no-cache-dir -r requirements.txt

# Default working directory inside container


# Default shell
CMD ["/bin/bash"]