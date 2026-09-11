# Attribution

Watermark-removal logic in this directory is **adapted** from the upstream
open-source project:

- **Project:** `watermarks-remover`
- **Upstream URL:** https://github.com/guillaumemeyer/watermarks-remover
- **Original author:** © 2026 Guillaume Meyer and contributors
- **License:** MIT

The MIT License text (preserved from upstream) is reproduced below:

---

## MIT License

Copyright (c) 2026 Guillaume Meyer and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## What Toolify changes

The upstream `watermarks-remover` ships a stdlib HTTP service (`server.py`) that
exposes `/inspect`, `/clean`, `/detect`, `/watermark` etc. over JSON envelopes
with base64 payloads.

For Toolify we ship a **thin FastAPI wrapper** (`app.py`) instead, with a simpler
contract tailored to the web frontend:

- `POST /remove` accepts **multipart/form-data** with a single `file` field
  (PDF / DOCX / images up to 50 MB).
- Returns the cleaned file directly as a binary download.
- `GET /health` returns dep availability for compose healthchecks.
- `GET /capabilities` lists supported extensions.

The upstream `service/scripts/*.py` are copied into the image at build time
(see `Dockerfile`) and invoked as a subprocess by `app.py`. We pin to a recent
upstream commit in the `Dockerfile` (`WATERMARKS_REF` build arg).

No upstream source files were modified. The MIT attribution is preserved
verbatim per the license terms.
