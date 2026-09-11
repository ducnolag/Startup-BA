# Toolify pdf-translator — FastAPI sidecar that translates a PDF while
# preserving its layout (positions, fonts, columns, images). Pipeline:
#   PyMuPDF (span extract) → Gemini (translate) → PyMuPDF (redact + re-render).
#
# We ship fonts-noto-cjk so the CJK fallback path can register a font that
# actually has the glyphs (insert_textbox will display boxes otherwise).

# syntax=docker/dockerfile:1.7

FROM python:3.11-slim AS runtime

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8767 \
    PDF_TRANSLATOR_VERSION=1.0.0-toolify

# fonts-noto-cjk: CJK glyph fallback for zh/ja/ko translations.
# We do NOT install reportlab system deps beyond what its wheels bundle.
RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates \
        fonts-noto-cjk \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt app.py ./
RUN pip install --no-cache-dir "pip==24.2" && \
    pip install --no-cache-dir -r requirements.txt

# Non-root user (matches agent-runner / watermark-remover convention).
RUN useradd --create-home --shell /usr/sbin/nologin --uid 1001 pdftrans && \
    chown -R pdftrans:pdftrans /app
USER pdftrans

EXPOSE 8767

HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=15s \
    CMD python -c "import urllib.request, sys; \
sys.exit(0 if urllib.request.urlopen('http://localhost:8767/health', timeout=5).status == 200 else 1)"

CMD ["python", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8767"]