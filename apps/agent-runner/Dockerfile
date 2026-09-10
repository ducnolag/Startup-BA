# Toolify — Agent Runner
# Multi-stage Python build for the Toolify shopping-agent HTTP server.

# syntax=docker/dockerfile:1.7
FROM python:3.12-slim AS builder

ENV PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /build

# Install build deps first for better layer caching
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy vendored packages and our wrapper, plus requirements
COPY requirements.txt ./
COPY agent_runner ./agent_runner
COPY shopping_agent ./shopping_agent
COPY shopping_agent_runtime ./shopping_agent_runtime
COPY commerce_common ./commerce_common
COPY skills ./skills

# Install dependencies (the seven packages + anthropic etc.)
RUN pip install --upgrade pip && \
    pip install -r requirements.txt && \
    pip install --no-deps starlette sse-starlette uvicorn httpx anthropic pydantic

# ---------- runtime stage ----------
FROM python:3.12-slim AS runtime

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8765 \
    AGENT_MODEL=claude-sonnet-4-5

WORKDIR /app

# Install only runtime deps (no build tools)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy app code
COPY --from=builder /build/agent_runner ./agent_runner
COPY --from=builder /build/shopping_agent ./shopping_agent
COPY --from=builder /build/shopping_agent_runtime ./shopping_agent_runtime
COPY --from=builder /build/commerce_common ./commerce_common
COPY --from=builder /build/skills ./skills

# Create non-root user
RUN useradd --create-home --shell /bin/bash --uid 1001 toolify
USER toolify

EXPOSE 8765

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8765/health', timeout=5)" || exit 1

CMD ["python", "-m", "agent_runner.runner"]
