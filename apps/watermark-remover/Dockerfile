# Toolify watermark-remover — multi-stage build
#
# Stage 1 (upstream): shallow-clone watermarks-remover at a pinned ref.
# Stage 2 (runtime): python:3.12-slim + exiftool + qpdf + ghostscript + OpenCV
#                     runtime deps + (optional) c2patool
#                     + copy upstream scripts + Toolify FastAPI wrapper.

# syntax=docker/dockerfile:1.7

# ---------- Stage 1: upstream sources ----------
FROM alpine:3.20 AS upstream

ARG WATERMARKS_REF=v0.7.0
ARG WATERMARKS_REPO=https://github.com/guillaumemeyer/watermarks-remover.git

RUN apk add --no-cache git ca-certificates && \
    git clone --depth 1 --branch "${WATERMARKS_REF}" "${WATERMARKS_REPO}" /upstream

# ---------- Stage 2: runtime image ----------
FROM python:3.12-slim AS runtime

ARG WATERMARKS_REF=v0.7.0
ENV WATERMARKS_REF=${WATERMARKS_REF} \
    WATERMARKS_VERSION=1.0.0-toolify \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8766 \
    WATERMARKS_VISUAL_MODE=auto

# System deps for metadata stripping:
#   exiftool    — EXIF / XMP / IPTC removal across images
#   qpdf        — PDF structure rewriting (PDF metadata + linearization)
#   ghostscript — deep image re-distill inside PDF (catches embedded SynthID)
# OpenCV runtime libs (libgl1, libglib) for visual inpainting.
RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates \
        ghostscript \
        libarchive-zip-perl \
        libgl1 \
        libglib2.0-0 \
        libimage-exiftool-perl \
        qpdf \
    && rm -rf /var/lib/apt/lists/*

# Copy upstream scripts (mit-licensed, see apps/watermark-remover/ATTRIBUTION.md)
COPY --from=upstream /upstream/service/scripts /app/scripts

# Normalize modes (mirror upstream Dockerfile hardening — don't inherit builder umask)
RUN chmod -R a+rX /app/scripts

# Toolify FastAPI wrapper
WORKDIR /app
COPY requirements.txt app.py ./
RUN pip install --no-cache-dir "pip==24.2" && \
    pip install --no-cache-dir --default-timeout=300 --retries=5 -r requirements.txt

# Non-root user (matches agent-runner convention)
RUN useradd --create-home --shell /usr/sbin/nologin --uid 1001 wmremover && \
    chown -R wmremover:wmremover /app
USER wmremover

EXPOSE 8766

HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=15s \
    CMD python -c "import urllib.request, sys; \
sys.exit(0 if urllib.request.urlopen('http://localhost:8766/health', timeout=5).status == 200 else 1)"

CMD ["python", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8766"]
