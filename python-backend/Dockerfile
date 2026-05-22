FROM python:3.11-slim

WORKDIR /app

# Install system dependencies required for document processing and building pycairo
RUN apt-get update && apt-get install -y \
    fontconfig \
    fonts-liberation \
    build-essential \
    pkg-config \
    libcairo2-dev \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
