# Before/After test cho watermark-remover

Tạo fixture + chạy tool + so sánh kết quả bằng evidence thật (SSIM, perceptual hash, pixel diff, metadata diff).

## Cách chạy

### 1. Lần đầu

```powershell
cd D:\Startup-BA\scripts\test-watermark
python -m venv pdf-test-env
.\pdf-test-env\Scripts\python.exe -m pip install pillow reportlab pdf2image imagehash scikit-image
# Cài Poppler binary cho pdf2image (nếu chưa có ở PATH):
#   - Tải release https://github.com/oschwartz10612/poppler-windows/releases
#   - Giải nén vào thư mục `poppler/` của test suite này
#   - Update POPPLER_PATH constant trong compare.py nếu khác version
```

### 2. Tạo fixture (PDF có AI metadata)

```powershell
.\pdf-test-env\Scripts\python.exe make_ai_pdf.py
```

### 3. Chạy tool lên fixture

```powershell
curl.exe -s -X POST http://localhost:3000/api/tools/watermark-remover `
  -F "file=@ai_marked.pdf" `
  -o cleaned_ai.pdf
```

### 4. So sánh metadata trước/sau

```powershell
.\pdf-test-env\Scripts\python.exe compare_meta.py ai_marked.pdf cleaned_ai.pdf
```

### 5. So sánh pixel trước/sau (chỉ cho visual watermark — hiện không có test pass loại này, xem báo cáo)

```powershell
.\pdf-test-env\Scripts\python.exe compare.py
```

## Kết quả gần nhất

- **PDF với metadata AI** (`/Author=ChatGPT`, `/Creator=Adobe Firefly v3.1`, `/Producer=Adobe Firefly Content Credentials v1.0`): sau khi chạy tool, **8/8 field trống** (Author, Creator, Producer, Title, Subject, Keywords, CreationDate, ModDate). Bằng chứng: xem `compare_meta.py` output ở cuối file log.
- **PDF không có visual watermark nhưng có metadata clean**: tool không làm gì (file byte-identical) — đúng kỳ vọng.
- **PDF với visual watermark vector text "CONFIDENTIAL"**: tool không xóa (SSIM = 1.0000, 0 pixel thay đổi). Sidecar là **metadata stripper**, không phải visual watermark remover.

## Phạm vi đúng của tool

Sidecar `apps/watermark-remover/app.py` được adapt từ `guillaumemeyer/watermarks-remover` — vốn là **metadata stripper cho AI provenance** (C2PA manifest, EXIF, XMP, doc properties). Nó **không cố** xóa:
- Visual watermark (text/image overlay)
- Pixel-domain watermarks (Google SynthID image — chỉ research mới xóa được)

Nếu cần visual watermark remover thật, đó là tool khác và làm riêng.

## Cấu trúc files

| File | Vai trò |
|------|---------|
| `make_ai_pdf.py` | Tạo PDF có metadata AI (Adobe Firefly, GPT-4, v.v.) |
| `make_pdf.py` | Tạo PDF có visual watermark text "CONFIDENTIAL" (control — không dùng) |
| `compare_meta.py` | So trước/sau metadata (Author/Creator/Producer/Title/Subject/Keywords/timestamps) |
| `compare.py` | So pixel trước/sau (SSIM + perceptual hash + changed pixel count) |
| `poppler/` | (gitignored) Binary poppler cần cho pdf2image trên Windows |
| `pdf-test-env/` | (gitignored) Venv Python cho test scripts |
