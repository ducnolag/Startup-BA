# Phân Tích Nghiệp Vụ — Nền Tảng Tool Cho Người Việt

> Phiên bản: v0.3 — Ngày cập nhật: 30/08/2026
> Tác giả: [Bạn]
> Trạng thái: Bản nháp — đã bổ sung trích dẫn nguồn, điều chỉnh đối tượng từng tool, làm rõ "ngách" Tool 2
>
> **Lịch sử thay đổi:**
> - v0.1 (30/08/2026): Tạo tài liệu ban đầu
> - v0.2 (30/08/2026): Bổ sung Phần 0 — Tóm tắt dự án (6 mục bắt buộc)
> - v0.3 (30/08/2026): Thêm trích dẫn nguồn cho số liệu, đánh dấu ước tính cần xác thực, làm rõ ngách Tool 2 ("trợ lý mua sắm thông minh"), tách rõ đối tượng Tool 1 (chỉ sinh viên) vs Tool 2 (đa dạng persona)

## MỤC LỤC

**PHẦN 0 — TÓM TẮT DỰ ÁN**
- 0.1. Tóm tắt ngắn gọn về ý tưởng/dự án
- 0.2. Sự cần thiết
- 0.3. Tính khả thi
- 0.4. Tính độc đáo và sáng tạo
- 0.5. Hiệu quả và triển vọng tiềm năng
- 0.6. Nguồn lực thực hiện

**PHẦN 1–7 — PHÂN TÍCH NGHIỆP VỤ CHI TIẾT**
- Phần 1. Tầm nhìn & Định vị
- Phần 2. Tool 1: Học Bổng & Khóa Học Aggregator
- Phần 3. Tool 2: So Sánh & Gợi Ý Giá Sản Phẩm
- Phần 4. Nền Tảng Chung (Umbrella Brand)
- Phần 5. Lộ Trình Triển Khai (12 Tuần)
- Phần 6. Phân Tích Rủi Ro & Cách Giảm Thiểu
- Phần 7. Bước Tiếp Theo Ngay Hôm Nay

---

## PHẦN 0 — TÓM TẮT DỰ ÁN

### 0.1. Tóm tắt ngắn gọn về ý tưởng/dự án

**Tên dự án (đề xuất):** Toolify.vn

**Mô hình kinh doanh:**
Nền tảng cung cấp **nhiều tool nhỏ, miễn phí/có phí thấp**, phục vụ giải quyết các vấn đề trong thực tế. Mỗi tool giải quyết một vấn đề cụ thể, nhưng dùng chung hạ tầng (domain, database, thanh toán, xác thực người dùng).

**Hai tool khởi đầu:**
1. **Tìm kiếm săn học Bổng & Khóa Học** — tổng hợp, lọc và cảnh báo học bổng/khóa học từ nhiều nguồn phù hợp với mong muốn điều kiện của mỗi người
2. **So Sánh & Gợi Ý Giá Sản Phẩm** — so sánh giá sản phẩm trên các sàn TMĐT lớn tại VN, kèm lịch sử giá và cảnh báo giảm giá không nên mua trong thời điểm giá đang cao

**Mục tiêu 6 tháng đầu:**
- 3.000 người dùng đăng ký
- 200 user trả phí (premium 49k–199k/tháng)
- Doanh thu: 5–10 triệu/tháng (từ affiliate + premium + ads)
- Database: 500+ học bổng/khóa học + 5.000+ sản phẩm

**Mục tiêu 12 tháng:**
- 10.000 người dùng
- 500 user trả phí
- Doanh thu: 20–50 triệu/tháng
- Ra mắt tool thứ 3

**Đội ngũ:** 1 founder (sinh viên), có khả năng tự code hoặc điều phối no-code/low-code.

---

### 0.2. Sự cần thiết

**Tại sao dự án này cần tồn tại — 3 bằng chứng rõ ràng:**

#### Bằng chứng 1: Sinh viên VN thiếu thông tin tập trung về cơ hội học tập

> **Nguồn tham khảo đã xác thực:**
> - Số liệu sinh viên: Bộ GD&ĐT công bố năm học 2023–2024, đăng trên Thanh Niên ([thanhnien.vn](https://thanhnien.vn/quy-mo-giao-duc-dh-tang-hon-300000-sinh-vien-trong-nam-hoc-2023-2024-185250522162830238.htm)) và Giáo dục 24h ([giaoduc247.vn](https://giaoduc247.vn/giao-duc-24h/quy-mo-giao-duc-dh-tang-manh-trong-nam-hoc-qua))
> - Tổng quan giáo dục: Tuổi Trẻ Online ([tuoitre.vn](https://tuoitre.vn/toan-canh-giao-duc-viet-nam-nam-hoc-2024-2025-2024090510153954.htm))

**Dữ kiện đã xác thực:**
- Quy mô đào tạo đại học năm học 2023–2024: **2.355.711 sinh viên** (tăng 319.022 so với 2023), gồm 1.819.416 công lập + 536.295 tư thục. Tổng số trường ĐH: 243 (176 công lập + 67 tư thục).
- Quy mô giáo dục cả nước năm học 2024–2025: **hơn 25 triệu học sinh, sinh viên** ở tất cả các cấp.
- Tỷ lệ sinh viên/1 vạn dân năm 2024: **230 SV/vạn dân** (tăng 37% so với 2019).

**Dữ kiện cần xác thực thêm qua khảo sát thực tế** (chưa có nguồn chính thức — cần phỏng vấn sinh viên ở giai đoạn xác thực):
- Tỷ lệ sinh viên khó tiếp cận thông tin học bổng (ước tính nội bộ: phần lớn SV năm nhất không biết có học bổng Chevening/Erasmus/Fulbright)
- Tỷ lệ sinh viên không biết có khóa học miễn phí chất lượng cao từ Coursera, edX (ước tính nội bộ)
- Tỷ lệ bỏ lỡ deadline học bổng (ước tính nội bộ: phổ biến vì thiếu kênh tổng hợp)

> 📌 **Lưu ý quan trọng:** Các tỷ lệ % ở trên là **ước tính định tính**, KHÔNG phải số liệu đã được khảo sát chính thức. Trong giai đoạn xác thực (tuần 1–2 của roadmap), cần khảo sát ít nhất **50–100 sinh viên** để có con số thực. Mình sẽ hỗ trợ bạn thiết kế bảng khảo sát.

- **Hệ quả thực tế**: sinh viên tự tìm trên Google, vào fanpage rải rác, hỏi bạn bè — mất **nhiều giờ mỗi tuần** cho việc săn thông tin. Với quy mô 2,35 triệu SV ĐH, đây là một vấn đề ảnh hưởng tới hàng triệu người.

#### Bằng chứng 2: Người mua sắm online VN đang trượt mất giá trị mỗi năm

> **Nguồn tham khảo đã xác thực:**
> - Quy mô B2C e-commerce 2025: **~31 tỷ USD** theo Bộ Công Thương ([vnmarketinsights.com](https://vnmarketinsights.com/ecommerce))
> - Quy mô e-commerce forecast 2026: **33,57 tỷ USD**, CAGR 21,08% đến 2031 đạt 87,36 tỷ USD (Mordor Intelligence — [mordorintelligence.com](https://www.mordorintelligence.com/industry-reports/vietnam-ecommerce-market))
> - Doanh số 4 sàn lớn (Shopee, Lazada, Tiki, TikTok Shop) quý 3/2025: **103.600 tỷ VNĐ**, tăng 22,25% so với cùng kỳ 2024 (Metric Vietnam — [metric.vn](https://metric.vn/resource/blog/metric-bao-cao-thi-truong-san-thuong-mai-dien-tu-viet-nam-quy-3-2025))

**Dữ kiện đã xác thực:**
- Thị trường e-commerce VN 2025 đạt khoảng **31 tỷ USD** (Bộ Công Thương) — chiếm gần 10% tổng bán lẻ.
- Quý 3/2025: doanh số 4 sàn lớn đạt 103,6 nghìn tỷ đồng (~4 tỷ USD), tăng trưởng 22,25% so với cùng kỳ 2024.
- CAGR dự kiến 2025–2031: **21,08%** (Mordor).

**Dữ kiện cần xác thực thêm** (chưa có nguồn chính thức — cần phỏng vấn người dùng):
- Tỷ lệ người mua hàng VN thực sự so sánh giá trước khi mua (ước tính nội bộ: thiểu số)
- Giá trị trung bình "lãng phí" do mua ở sàn đầu tiên (ước tính nội bộ: 10–25% giá trị đơn hàng)
- Số biến thể giá trung bình của một sản phẩm trên các sàn (ước tính nội bộ: 3–7 biến thể do voucher, flash sale, khác shop)

**Khoảng trống thị trường:**
- iPrice từng hoạt động ở VN nhưng đã rút khỏi thị trường; giao diện hỗ trợ tiếng Việt còn hạn chế.
- BeeCost chỉ tập trung so sánh giá tổng quát, không có tính năng **gợi ý & khuyến nghị thông minh** (xem chi tiết ở 0.4).
- Chưa có công cụ tiếng Việt nào cung cấp đồng thời: so sánh giá + lịch sử giá + phát hiện "giá ảo" + khuyến nghị thời điểm mua + tổng hợp review đa nguồn.

> 📌 **Lưu ý:** Các số liệu phần trăm và "ước tính" cần được kiểm chứng bằng khảo sát thực tế trong tuần 1–2. Mình sẽ hỗ trợ thiết kế bảng khảo sát.


**Tác động xã hội dự kiến:**
- Hỗ trợ hàng nghìn sinh viên tiếp cận cơ hội giáo dục mà họ bỏ lỡ
- Giúp sinh viên tiết kiệm **trung bình 200k–500k/tháng** khi mua sắm thông minh
- Tạo cộng đồng chia sẻ kiến thức (review khóa học, tip săn sale)

---

### 0.3. Tính khả thi

Dự án khả thi vì **cả 4 yếu tố đầu vào đều sẵn sàng**:

#### Khả thi về kỹ thuật
- **Công nghệ chín muồi**: Next.js, Python, Supabase, API các sàn TMĐT — tất cả đã có tài liệu, cộng đồng lớn
- **Nguồn dữ liệu có sẵn**: 4 API affiliate sàn TMĐT (Shopee, Lazada, Tiki, TikTok Shop) + Coursera API + edX API — đều miễn phí
- **Không cần công nghệ đột phá**: bài toán scraping + database + UI cơ bản, sinh viên IT năm 3–4 có thể làm được
- **Thời gian phát triển MVP**: 12 tuần cho 2 tool với 1 người làm part-time

#### Khả thi về tài chính
- **Tổng chi phí năm đầu: < 500.000 VNĐ** (chủ yếu là domain ~150–300k)
- **Tất cả công cụ phát triển đều có free tier đủ dùng**: Vercel, Supabase, GitHub Actions, Resend, Telegram Bot
- **Không cần vốn đầu tư ngoài** — phù hợp sinh viên
- **Điểm hòa vốn**: chỉ cần ~50 user trả phí 49k/tháng = 2,5 triệu/tháng = đủ cover chi phí + có lợi nhuận nhỏ

#### Khả thi về thị trường
- **Nhu cầu đã được kiểm chứng gián tiếp**:
  - BeeCost có traffic hàng triệu/tháng nhưng không tập trung SV VN
  - iPrice mạnh ở Indonesia/Thailand nhưng yếu ở VN
  - ScholarshipPortal có 30 triệu user toàn cầu nhưng UI tiếng Anh, không phù hợp SV VN
- **Đối thủ trực tiếp ở VN: rất ít hoặc không có** cho mô hình "all-in-one cho SV"
- **Đường vào thị trường**: organic (Facebook group SV, TikTok) — không tốn quảng cáo

#### Khả thi về nhân sự & thời gian
- **1 founder** có thể vận hành MVP + marketing organic trong 3 tháng đầu
- **Cam kết thời gian khả thi**: 15–20 giờ/tuần 
- **Có thể tuyển cộng sự viên part-time** từ bạn cùng lớp khi có doanh thu (chia % doanh thu)

#### Rủi ro khả thi đã nhận diện
- Rủi ro: API sàn thay đổi → **Giảm thiểu**: dùng cả API + scraping fallback + user submit link
- Rủi ro: Không có user trả tiền → **Giảm thiểu**: validate free trước, thử nhiều mức giá
- Rủi ro: Founder burnout → **Giảm thiểu**: scope MVP nhỏ, manual trước, chỉ automate khi đau

---

### 0.4. Tính độc đáo và sáng tạo

#### Điểm độc đáo #1: Mô hình "Umbrella Tool Platform" — chưa ai làm ở VN
- Thay vì làm 1 tool lớn, dự án xây **nhiều tool nhỏ dưới chung 1 thương hiệu**
- **Lợi thế**: cross-sell tự nhiên (user dùng tool A → dễ thử tool B), chia sẻ hạ tầng, brand recall
- **Điểm mới ở VN**: chưa có ai áp dụng mô hình này cho đối tượng sinh viên cụ thể
- **Ví dụ tương tự thành công quốc tế**: Product Hunt (nhiều tool/sản phẩm dưới 1 brand), NerdWallet (nhiều công cụ tài chính dưới 1 brand)

#### Điểm độc đáo #2: "Crowdsourced + AI-assisted matching" cho học bổng
- **Sáng tạo ở chỗ**: cho phép cộng đồng submit học bổng/khóa học mới, kết hợp với rule-based matching theo profile người dùng (ngành, GPA, quốc gia, deadline)
- **Khác biệt**: scholarship portal quốc tế chỉ list, không match; các fanpage VN chỉ post, không có hệ thống lọc
- **Sáng tạo kỹ thuật**: dùng Supabase + Edge Functions để gợi ý real-time khi user cập nhật profile

#### Điểm độc đáo #3: "Gợi ý & Khuyến nghị thông minh" — không chỉ so sánh giá đơn thuần
> **Phân tích khoảng trống thị trường:** BeeCost, iPrice chỉ làm "so sánh giá" — bảng giá đơn giản, không có trí tuệ phân tích. Người dùng vẫn phải tự đánh giá: "giá này có tốt không?", "có nên mua bây giờ không?", "có sản phẩm nào tương tự rẻ hơn không?". Đây chính là **ngách (niche) còn thiếu** mà dự án lấp vào.

**So sánh tính năng với đối thủ hiện tại:**

| Tính năng | BeeCost | iPrice | Công cụ của bạn |
|---|---|---|---|
| So sánh giá đa sàn | Có | Có | Có |
| Lịch sử giá | Một phần | Một phần | Có (chi tiết 90 ngày) |
| Phát hiện "giá ảo" (giảm giá sâu nhưng giá thực cao) | Không | Không | Có |
| Gợi ý sản phẩm tương tự rẻ hơn (cùng spec) | Không | Không | Có |
| Khuyến nghị "có nên mua bây giờ không" | Không | Không | Có (dựa trên lịch sử + xu hướng) |
| Tổng hợp review đa nguồn (TikTok, YouTube, blog) | Không | Không | Có |
| Cảnh báo sản phẩm chất lượng kém / lừa đảo | Không | Không | Có |
| Paste link → trả kết quả (UX mới) | Không | Không | Có |
| Cá nhân hóa theo nhu cầu người dùng | Không | Một phần | Có |

**Tính năng "khuyến nghị thông minh" cốt lõi** (đây là **ngách khác biệt** — kết hợp những thứ đang thiếu từ các nền tảng trước đó):
1. **Phát hiện giá ảo**: so sánh giá hiện tại với lịch sử 90 ngày → flag nếu "giá gốc" cao bất thường
2. **Gợi ý thời điểm mua**: dựa trên chu kỳ giá, báo "đợi thêm X ngày có thể giảm Y%"
3. **Gợi ý sản phẩm tương đương rẻ hơn**: cùng CPU/RAM/dung lượng nhưng giá thấp hơn 20%+
4. **Tổng chi phí thực**: cộng giá sản phẩm + ship + voucher → so sánh tổng bill cuối cùng
5. **Tổng hợp review**: scrape review từ TikTok, YouTube review, blog uy tín → đưa ra verdict
6. **Cảnh báo rủi ro**: shop mới, rating thấp, hàng giả, return rate cao
7. **Wishlist thông minh**: lưu sản phẩm + cảnh báo khi giá giảm về mức "nên mua"

> **Lưu ý về ngách (niche):** Ngách của Tool 2 KHÔNG phải "so sánh giá" (đã bão hòa), mà là **"trợ lý mua sắm thông minh"** — kết hợp tất cả những gì các nền tảng trước đó thiếu (giá ảo, gợi ý thời điểm mua, tổng hợp review, cảnh báo rủi ro, cá nhân hóa). Đây là positioning để bạn không cạnh tranh trực tiếp với BeeCost/iPrice về "bảng giá", mà phục vụ một bài toán lớn hơn: **"Tôi có nên mua sản phẩm này không, mua ở đâu, khi nào, và liệu có lựa chọn tốt hơn không?"**

#### Điểm độc đáo #4: Trải nghiệm "Mobile-first + Tiếng Việt + Hiểu ngữ cảnh VN"
- **Khác biệt**: Google Shopping/ScholarshipPortal — UI tiếng Anh, không tối ưu mobile
- **iPrice/BeeCost** — giao diện chung chung, không sâu vào bài toán tiếng Việt
- **Công cụ của bạn**:
  - Tool 1: section "học bổng chính phủ VN", "khóa học free có chứng chỉ VN", v.v.
  - Tool 2: voucher riêng cho Shopee/Lazada VN, gợi ý ship nội địa, đánh giá shop theo tiêu chí VN
- **Yếu tố cộng đồng**: cho phép người dùng chia sẻ kinh nghiệm mua sắm, review — tạo moat (hào phòng thủ)

#### Điểm độc đáo #5: Mô hình "Freemium + Affiliate + B2B" đa tầng
- **Sáng tạo ở chỗ**: kết hợp 3 nguồn doanh thu trên cùng 1 nền tảng
  - Affiliate: ai cũng có thể earn (kể cả user free)
  - Premium: cá nhân trả 49k/tháng
  - B2B API: SME/trường ĐH trả 500k+/tháng
- **So sánh**: iPrice chỉ có quảng cáo + affiliate; Coursera chỉ có premium; ScholarshipPortal chỉ có quảng cáo
- **Lợi thế**: đa dạng hóa doanh thu, giảm rủi ro phụ thuộc 1 nguồn

---

### 0.5. Hiệu quả và triển vọng tiềm năng của dự án

#### Hiệu quả kinh tế dự kiến

| Giai đoạn | Thời gian | User | Premium | Doanh thu/tháng |
|---|---|---|---|---|
| MVP ra mắt | Tháng 1–3 | 1.000 | 20 | 1–2 triệu (affiliate) |
| Tăng trưởng | Tháng 4–6 | 3.000 | 100 | 5–10 triệu |
| Ổn định | Tháng 7–12 | 10.000 | 500 | 20–50 triệu |
| Mở rộng | Năm 2 | 30.000 | 1.500 | 80–150 triệu |

**Cơ sở ước tính:**
- Tỷ lệ chuyển đổi free → premium: 2–5% (benchmark ngành)
- Affiliate commission trung bình: 3% giá trị đơn hàng (user click qua tool so sánh giá)
- Premium giá 49k/tháng × 200 user = ~10 triệu

#### Hiệu quả xã hội (tác động định lượng được)

- **Học bổng**: nếu giúp 100 SV nhận được học bổng (giá trị TB 20 triệu/suất) = 2 tỷ VNĐ giá trị giáo dục tạo ra
- **Tiết kiệm**: nếu 5.000 user tiết kiệm TB 200k/tháng = 1 tỷ VNĐ/năm
- **Cộng đồng**: tạo sân chơi cho SV chia sẻ review khóa học, kinh nghiệm — đóng góp giáo dục phi chính thức

#### Triển vọng mở rộng (năm 2–3)

1. **Mở rộng thị trường**:
   - Đông Nam Á: Indonesia, Philippines, Thailand — cùng pain point với SV
   - Thị trường ngách: SME/freelancer Việt (so sánh giá SaaS, hosting, AI tools)
2. **Mở rộng sản phẩm**:
   - Tool 3 (tháng 7): So sánh giá SaaS/hosting cho SME
   - Tool 4 (tháng 12): Công cụ tạo CV + match việc làm cho SV
   - Tool 5 (năm 2): Công cụ quản lý tài chính cá nhân cho SV
3. **Mở rộng mô hình kinh doanh**:
   - B2B API cho trường ĐH, công ty tuyển dụng, sàn TMĐT nhỏ
   - Marketplace kết nối SV với nhà cung cấp khóa học (commission)
   - Khóa học nội dung riêng (đào tạo kỹ năng tìm học bổng, săn sale)

#### Tiềm năng thoái vốn (Exit)

- **Mua lại bởi công ty giáo dục** (Topica, Hocmai, FUNiX): nếu đạt 100k+ user SV
- **Mua lại bởi sàn TMĐT**: Shopee, Tiki có thể quan tâm nếu tool có traffic lớn
- **Vòng gọi vốn**: nếu doanh thu > 100 triệu/tháng, có thể raise seed từ quỹ trong nước (Quest Ventures, 500 Startups VN, Do Ventures)
- **Bootstrapping vĩnh viễn**: vẫn có thể giữ làm side-business ổn định 20–50 triệu/tháng

---

### 0.6. Nguồn lực thực hiện

#### Nguồn lực nhân sự

| Vai trò | Số lượng | Trạng thái | Chi phí |
|---|---|---|---|
| Founder (kiêm Product, Dev, Marketing) | 1 | Sẵn có (bạn) | 0 đ (tự đầu tư thời gian) |
| Cộng sự Content (viết blog, quản MXH) | 1 | Cần tuyển part-time tháng 3 | Chia % doanh thu hoặc thưởng theo KPI |
| Cộng sự Dev (hỗ trợ khi scale) | 1 | Cần tuyển part-time tháng 6 | Chia % doanh thu |
| Mentor/Cố vấn | 1–2 | Cần tìm (giảng viên, anh chị đi trước) | 0 đ (mentor tình nguyện hoặc đổi lại equity nhỏ) |

**Yêu cầu năng lực của founder:**
- Biết code (Next.js, Python cơ bản) **HOẶC** biết dùng no-code + có khả năng điều phối dev
- Hiểu marketing organic (Facebook, TikTok, SEO cơ bản)
- Có khả năng phỏng vấn khách hàng + tổng hợp insight
- Cam kết 15–20 giờ/tuần trong 6 tháng đầu

#### Nguồn lực tài chính

| Hạng mục | Số tiền | Nguồn | Ghi chú |
|---|---|---|---|
| Domain (.com) | 150.000–300.000/năm | Tiền cá nhân | Mua 1 lần/năm |
| Domain (.vn) | 200.000–500.000/năm | Tiền cá nhân | Tùy chọn |
| Hosting (Vercel, Supabase, GH Actions) | 0 đ | Free tier | Đủ dùng cho < 10k user |
| Email service | 0 đ | Resend/Brevo free tier | 3.000 email/tháng |
| Thanh toán setup | 0 đ | PayOS, Stripe | Không phí setup |
| Thiết kế logo, branding | 0 đ | Canva AI / Looka free | Tự làm |
| **Tổng giai đoạn đầu** | **< 500.000 đ** | Tiền cá nhân | |

**Cơ chế tài trợ mở rộng** (sau khi có doanh thu):
- Tháng 4–6: tái đầu tư 30% doanh thu vào quảng cáo Facebook/TikTok (nếu có ROI dương)
- Tháng 7+: có thể raise pre-seed từ quỹ hoặc angel investor nếu tăng trưởng tốt
- Luôn có option **bootstrap vĩnh viễn** — không bắt buộc phải gọi vốn

#### Nguồn lực công nghệ (tất cả free)

| Layer | Công cụ | Lý do chọn |
|---|---|---|
| Frontend | Next.js 14 | Phổ biến, SEO tốt, free Vercel hosting |
| Backend | Supabase | Postgres + Auth + Storage miễn phí 500MB |
| Database | Supabase Postgres | Đủ cho đến 10k+ user |
| Scraper | Python + Playwright | Mạnh, miễn phí, chạy trên GH Actions |
| Cron jobs | GitHub Actions | 2000 phút/tháng free |
| Thanh toán VN | PayOS | Tỷ lệ phí thấp, dễ tích hợp |
| Thanh toán quốc tế | Stripe | Free cho đến doanh thu lớn |
| Email | Resend / Brevo | 3000 email/tháng free |
| Notification | Telegram Bot API | Miễn phí hoàn toàn |
| Analytics | Plausible Cloud ($9/mo) hoặc Umami self-host free | Privacy-friendly |
| Error tracking | Sentry free tier | 5k events/tháng free |
| Design | Figma (free) + Canva AI | Free cho cá nhân |
| Version control | GitHub free | Repo private unlimited |

#### Nguồn lực đối tác

| Đối tác | Mối quan hệ | Lợi ích |
|---|---|---|
| Shopee Affiliate | Đối tác dữ liệu + doanh thu | API + 1–5% hoa hồng |
| Lazada Affiliate | Đối tác dữ liệu + doanh thu | API + hoa hồng |
| Tiki Affiliate | Đối tác dữ liệu + doanh thu | API + hoa hồng |
| TikTok Shop Affiliate | Đối tác dữ liệu + doanh thu | API + hoa hồng |
| Coursera Affiliate | Đối tác khóa học | 15–45% hoa hồng mỗi đăng ký |
| edX Affiliate | Đối tác khóa học | Hoa hồng |
| Group Facebook sinh viên | Kênh phân phối | Organic reach miễn phí |
| Trường ĐH (phòng CT SV) | Kênh phân phối + B2B tiềm năng | Giới thiệu tới SV |
| Cộng đồng Product Hunt | Kênh ra mắt quốc tế | Free exposure |

#### Nguồn lực thời gian

| Giai đoạn | Thời gian cam kết | Tổng effort |
|---|---|---|
| MVP (12 tuần) | 20 giờ/tuần | 240 giờ |
| Ra mắt + tăng trưởng (3 tháng) | 15 giờ/tuần | 180 giờ |
| Ổn định + mở rộng (từ tháng 6) | 10–15 giờ/tuần (có thể thêm cộng sự) | 120–180 giờ/quý |

#### Nguồn lực kiến thức & hỗ trợ

- **Cộng đồng Open source**: GitHub, Stack Overflow, Discord dev VN
- **Tài liệu chính thức**: Next.js, Supabase, các API affiliate — đều có doc đầy đủ tiếng Anh
- **Khóa học miễn phí**: Có thể tự học bổ sung kỹ năng qua Coursera/edX (chính công cụ bạn xây!)
- **Cố vấn tiềm năng**: Giảng viên ĐH, anh chị khởi nghiệp trong ngành, mentor từ cộng đồng startup VN

---

## PHẦN 1 — TẦM NHÌN & ĐỊNH VỊ

### 1.1. Ý tưởng cốt lõi
Xây dựng một **nền tảng (umbrella brand)** gồm nhiều **tool nhỏ, tập trung, miễn phí/có phí thấp**, giải quyết các vấn đề thực tế của người Việt. Hai tool khởi đầu phục vụ **2 đối tượng khác nhau**:
- **Tool 1 (Học bổng & Khóa học)**: dành riêng cho **sinh viên / học sinh** (đối tượng ít tiền, cần săn cơ hội học tập)
- **Tool 2 (So sánh & Gợi ý giá)**: phục vụ **mọi người mua sắm online** — sinh viên, người đi làm, chủ shop, dropshipper, freelancer (đối tượng có nhu cầu chi tiêu thường xuyên → dễ ra tiền từ affiliate + premium)

**Lý do phân tách đối tượng:** sinh viên tiền ít, sức mua yếu → khó monetize. Ngược lại, người đi làm + chủ shop + dropshipper là đối tượng **chi tiêu thường xuyên và sẵn sàng trả phí cho tool tiết kiệm thời gian/tiền**. Tách 2 đối tượng giúp:
- Tool 1 tập trung tăng trưởng viral, build brand
- Tool 2 tập trung monetize (doanh thu chính)

### 1.2. Tại sao mô hình "nền tảng nhiều tool" khả thi
| Lợi ích | Giải thích |
|---|---|
| Chia sẻ hạ tầng | 1 domain, 1 hosting, 1 hệ thống thanh toán dùng cho nhiều tool |
| Cross-sell tự nhiên | SV dùng Tool 1 → tiếp cận Tool 2 khi cần mua đồ |
| Brand recall | Xây 1 thương hiệu dễ hơn N thương hiệu |
| Phân tán rủi ro | 1 tool fail không chết cả nền tảng |
| Mở rộng đường dài | Sau này thêm tool C, D, E… dùng chung hạ tầng |

### 1.3. Đối tượng mục tiêu theo từng tool

> **Lưu ý quan trọng:** Hai tool phục vụ 2 nhóm đối tượng KHÁC NHAU. Mục tiêu kinh doanh cũng khác nhau: Tool 1 = tăng trưởng + brand; Tool 2 = doanh thu chính.

---

**TOOL 1 — Đối tượng: SINH VIÊN / HỌC SINH** (ngách hẹp, ít tiền, dễ viral)

**Persona 1 — "Minh Sinh Viên"** (100% trọng tâm của Tool 1)
- Sinh viên ĐH năm 1–4, 18–22 tuổi
- Học sinh lớp 12 chuẩn bị vào ĐH
- Thu nhập thấp, phụ thuộc gia đình + part-time
- Cần: học bổng, khóa học free/giảm giá
- Hành vi: dùng Facebook, TikTok, Telegram; mobile-first
- **Mục tiêu kinh doanh với persona này**: tăng trưởng user, viral, build brand; monetize gián tiếp qua affiliate Coursera/edX (5–15% hoa hồng khi SV đăng ký khóa học)

---

**TOOL 2 — Đối tượng: NGƯỜI MUA SẮM ONLINE** (ngách rộng, sức mua cao, dễ monetize)

**Persona 2 — "Hương Fresher / Người đi làm trẻ"** (40% trọng tâm của Tool 2)
- Người đi làm 22–30 tuổi, thu nhập 5–20 triệu/tháng
- Mua sắm online 3–10 lần/tháng (đồ công nghệ, thời trang, đồ gia dụng)
- Cần: tiết kiệm thời gian so sánh giá, mua sắm thông minh
- Hành vi: dùng Shopee/Lazada/Tiki hàng ngày; tìm kiếm deal/review trước khi mua
- **Mục tiêu kinh doanh**: trả phí 49k–199k/tháng cho premium (tra cứu không giới hạn, wishlist, alert giảm giá); hoa hồng affiliate (1–5% mỗi đơn hàng)

**Persona 3 — "Anh Chủ Shop / Dropshipper"** (35% trọng tâm của Tool 2 — nhóm trả tiền cao nhất)
- Chủ shop nhỏ, dropshipper trên Shopee/Lazada/TikTok Shop
- Mua hàng cho shop 20–100 đơn/tháng
- Cần: theo dõi giá đối thủ, tìm nguồn hàng giá tốt, định giá cạnh tranh
- Hành vi: dùng nhiều sàn + extension; sẵn sàng trả 199k–999k/tháng
- **Mục tiêu kinh doanh**: gói B2B 499k–2tr/tháng (API + dashboard theo dõi giá thị trường); affiliate cao vì order value lớn

**Persona 4 — "Bà nội trợ / Người mua sắm gia đình"** (25% trọng tâm của Tool 2 — viral cao)
- 30–50 tuổi, mua sắm cho gia đình 5–15 đơn/tháng
- Giá trị đơn hàng cao (đồ gia dụng, thực phẩm, đồ cho con)
- Cần: săn sale, voucher, deal tốt nhất
- Hành vi: dùng Facebook Marketplace, Zalo group mua sắm; chia sẻ deal trong nhóm bạn bè
- **Mục tiêu kinh doanh**: viral (chia sẻ deal trong nhóm); affiliate trung bình

---

**Tại sao tách Tool 2 ra nhiều persona như vậy?**
- **Sinh viên (Persona 1)** không phải persona chính của Tool 2, vì họ mua ít, giá trị đơn hàng thấp → affiliate thấp, ít trả phí premium
- **Người đi làm + chủ shop + bà nội trợ** (Persona 2, 3, 4) mới là đối tượng "dễ ra tiền" — chi tiêu thường xuyên, sẵn sàng trả phí cho tool tiết kiệm thời gian và tiền
- Chiến lược: **Thu hút nhiều persona, tập trung vào persona có sức mua cao nhất (Persona 3 — chủ shop)**

---

## PHẦN 2 — TOOL 1: HỌC BỔNG & KHÓA HỌC AGGREGATOR

> **Đối tượng DUY NHẤT của Tool 1: Sinh viên đại học + Học sinh lớp 12 (chuẩn bị vào ĐH)**
> Đây là tool **chỉ phục vụ đối tượng ít tiền, cần săn cơ hội học tập**. Không mở rộng sang người đi làm hay chủ shop — đó là đối tượng của Tool 2. Mục tiêu kinh doanh của Tool 1: tăng trưởng user, viral, build brand; doanh thu chính từ affiliate Coursera/edX.

### 2.1. Vấn đề
- **Phân tán thông tin**: Học bổng nằm rải rác trên website trường, fanpage, scholarship portal quốc tế, đại sứ quán, NGO, forum
- **Bỏ lỡ deadline**: Không có hệ thống nhắc nhở tập trung
- **Khó lọc**: Sinh viên không biết học bổng nào phù hợp (theo ngành, GPA, quốc gia, tài chính)
- **Không đánh giá chất lượng**: Khóa học nào free thật sự, khóa nào chất lượng, khóa nào lừa đảo
- **Thiếu roadmap**: Học sinh lớp 12 không biết phải apply cái gì, khi nào

### 2.2. Giải pháp
Một web app tổng hợp + lọc + cảnh báo học bổng và khóa học, có tính năng cộng đồng đóng góp và đánh giá.

### 2.3. Tính năng MVP (v1 — 6 tuần)
**Bắt buộc có (must-have):**
1. **Database học bổng**: tối thiểu 50 học bổng VN + 50 quốc tế phổ biến (Chevening, Fulbright, Erasmus+, DAAD, học bổng chính phủ VN…)
2. **Database khóa học**: tối thiểu 100 khóa (Coursera, edX, Udemy free, Khan Academy, chương trình VN)
3. **Bộ lọc**: quốc gia, ngành, deadline, học phí, loại (học bổng/khóa học), ngôn ngữ
4. **Trang chi tiết**: mô tả, điều kiện, deadline, link apply, review
5. **Đăng ký nhận alert email/Telegram** khi có học bổng/khóa học mới phù hợp
6. **Submit link**: cộng đồng đóng góp học bổng mới (có duyệt)

**Nên có (nice-to-have v1):**
7. Lưu scholarship yêu thích
8. Calendar các deadline sắp tới
9. Đánh giá/review khóa học
10. CV/profile để gợi ý matching

**Không có ở v1:**
- AI matching tự động (dùng rule-based lọc trước)
- Hệ thống apply trực tiếp
- Mock interview/prep cho apply

### 2.4. Nguồn dữ liệu
| Nguồn | Loại | Cách lấy |
|---|---|---|
| scholarshipportal.com, scholarships.com | Học bổng quốc tế | Scrape + RSS |
| Website ĐH/foundation (Chevening, Fulbright, Erasmus) | Học bổng chính thống | Scrape định kỳ + API nếu có |
| Bộ GD&ĐT, Sở GD các tỉnh | Học bổng chính phủ VN | Scrape + đóng góp cộng đồng |
| Doanh nghiệp (VinGroup, FPT, VNG) | Học bổng tư nhân | Email + đóng góp cộng đồng |
| Coursera, edX, Udemy, Khan Academy | Khóa học | API (Coursera, edX) + scrape |
| Fanpage/group Facebook | Học bổng/du học | Manual + scrape có chọn lọc |
| Đóng góp người dùng | Tất cả | Form submit + duyệt |

**Lưu ý pháp lý**: Scrape có trách nhiệm (rate limit, ghi credit nguồn, không vi phạm ToS). Ưu tiên nguồn cho phép API. Với dữ liệu do cộng đồng đóng góp → có disclaimer + verify thủ công.

### 2.5. Mô hình doanh thu

> **Lưu ý:** Đối tượng là sinh viên → sức mua yếu → ưu tiên **miễn phí + doanh thu gián tiếp** (affiliate, quảng cáo) hơn là thu phí trực tiếp từ sinh viên.

| Nguồn | Dự kiến | Ghi chú |
|---|---|---|
| Affiliate Coursera/edX | 5–15% hoa hồng khi SV đăng ký khóa học qua link | **Nguồn thu chính** — dễ triển khai, SV có nhu cầu học thật |
| Affiliate Udemy, Coursera Plus | 5–45% hoa hồng | Mở rộng thêm nền tảng khóa học |
| Quảng cáo từ chương trình học bổng | Theo lead hoặc CPM | Khi đủ traffic (>5k user) |
| Premium SV (freemium nhẹ) | 19k–29k/tháng | Gói "sinh viên premium" giá rẻ: cảnh báo sớm 24h, CV review template, lọc nâng cao |
| B2B: trường ĐH/TT đào tạo | 500k–2tr/tháng | Widget embed trên website trường, đẩy traffic về tool |
| Tài trợ từ tổ chức học bổng | Tùy chương trình | Khi đủ traffic, các tổ chức có thể trả phí quảng bá học bổng của họ |

### 2.6. Chi phí ước tính (năm đầu)
| Hạng mục | Chi phí |
|---|---|
| Domain | 150k–300k/năm |
| Hosting (Vercel + Supabase free) | 0 đ |
| Scraping (Apify free tier + GH Actions) | 0 đ |
| Email (Resend/Brevo free tier) | 0 đ |
| Công sức (chính bạn) | 0 đ |
| **Tổng năm đầu** | **< 500k đ** |

### 2.7. KPI thành công (6 tháng đầu)
- 500+ scholarship + khóa học trong DB
- 1.000 email subscribers
- 100+ user premium (trả phí hoặc dùng free tier ổn định)
- 50+ review/đánh giá từ cộng đồng
- Affiliate revenue: 500k+/tháng

---

## PHẦN 3 — TOOL 2: SO SÁNH & GỢI Ý GIÁ SẢN PHẨM

> **Đối tượng của Tool 2: NGƯỜI MUA SẮM ONLINE (không chỉ sinh viên)** — bao gồm:
> - Người đi làm trẻ (Persona 2) — sức mua trung bình
> - Chủ shop / Dropshipper (Persona 3) — sức mua cao, trả phí cao
> - Người mua sắm gia đình (Persona 4) — viral cao
>
> **Tại sao không giới hạn ở sinh viên?** Sinh viên là nhóm tiền ít, sức mua yếu → affiliate thấp, ít trả phí premium. Để dễ ra tiền và đạt doanh thu bền vững, Tool 2 phải phục vụ **đối tượng chi tiêu thường xuyên và sẵn sàng trả phí** cho công cụ tiết kiệm thời gian/tiền. Tool 2 là **nguồn doanh thu chính** của nền tảng.

### 3.1. Vấn đề
- **Nhiều sàn, nhiều giá**: Cùng 1 sản phẩm, Shopee/Lazada/Tiki/Tiktok Shop/Sendo có giá khác nhau
- **Giá ảo**: Giảm giá 50% từ giá "gốc" 5 triệu xuống 2.5 triệu nhưng giá thực tế chỉ 3 triệu
- **Không so sánh được spec**: Cùng loại laptop nhưng khác RAM/SSD khó so
- **Không cảnh báo**: Sản phẩm yêu thích giảm giá mà không biết
- **Không có "giá tốt" chuẩn**: Người mua không biết bao nhiêu là giá hợp lý
- **Ngách còn thiếu**: BeeCost/iPrice chỉ so sánh giá đơn thuần, không có khuyến nghị thông minh, không tổng hợp review, không cảnh báo rủi ro shop (xem chi tiết tại Phần 0.4 — Điểm độc đáo #3)

### 3.2. Giải pháp
Một web app cho phép:
- **Paste link Shopee/Lazada/Tiki** → trả về: giá hiện tại, lịch sử giá 30 ngày, các sàn khác có sản phẩm tương tự
- **Gõ tên sản phẩm** → tool tự tìm trên nhiều sàn, sắp xếp theo giá
- **Submit link mới** → cộng đồng đóng góp database
- **Alert giảm giá** theo dõi sản phẩm cụ thể

### 3.3. Tính năng MVP (v1 — 6 tuần)
**Bắt buộc có:**
1. **Nhập link sản phẩm** từ Shopee, Lazada, Tiki (3 sàn chính)
2. **Parse sản phẩm**: tên, giá, ảnh, shop, rating
3. **Tìm sản phẩm tương tự** trên các sàn khác (theo tên/category)
4. **Bảng so sánh**: giá, ship, rating, link mua
5. **Lịch sử giá 30 ngày** (từ thời điểm sản phẩm được track)
6. **Lưu sản phẩm + alert giảm giá** qua email/Telegram
7. **Submit link** để cộng đồng đóng góp

**Nên có (nice-to-have v1):**
8. Phát hiện "giá ảo" (so với lịch sử giá)
9. Extension browser
10. So sánh theo spec (vd: laptop cùng CPU/RAM)
11. Gợi ý "giá tốt" dựa trên median 90 ngày

**Không có ở v1:**
- Dự đoán giá tương lai (ML)
- Đặt hàng trực tiếp
- Review tổng hợp từ YouTube/blog

### 3.4. Nguồn dữ liệu
| Nguồn | Cách lấy |
|---|---|
| Shopee Affiliate API | API chính thức, có hoa hồng |
| Lazada Open Platform | API chính thức |
| Tiki Affiliate | API chính thức |
| TikTok Shop | API chính thức (mới ra, còn hạn chế) |
| Sendo | Scrape có chọn lọc (Affiliate API hạn chế) |
| Đóng góp người dùng | Submit link + auto re-crawl mỗi ngày |

**Chiến lược**: Đăng ký affiliate của cả 4 sàn (đều free). Vừa có data API chính thống vừa có thêm thu nhập khi user mua qua link.

### 3.5. Mô hình doanh thu

> **Lưu ý:** Đối tượng đa dạng (người đi làm + chủ shop + gia đình) → sức mua cao → tập trung **doanh thu trực tiếp** (premium + affiliate + B2B). Đây là **nguồn doanh thu chính** của nền tảng.

| Nguồn | Dự kiến | Ghi chú | Đối tượng |
|---|---|---|---|
| Affiliate sàn TMĐT | 1–5% giá trị đơn hàng | 4 sàn chính (Shopee, Lazada, Tiki, TikTok Shop) | Tất cả persona |
| Premium cá nhân | 49k–99k/tháng | Tra cứu không giới hạn, lịch sử giá, alert giảm giá, wishlist | Persona 2 (fresher), Persona 4 (gia đình) |
| Premium chủ shop / Dropshipper | 299k–799k/tháng | API + dashboard theo dõi giá thị trường, đối thủ, định giá | **Persona 3 — nhóm trả tiền cao nhất** |
| B2B API cho SME | 999k–4,99 triệu/tháng | API calls, dashboard chuyên sâu, tích hợp extension | Persona 3, đối tác |
| Affiliate deal/sale | 1–3% | Chia sẻ deal trong group Zalo, Facebook | Persona 4 (viral) |
| Quảng cáo hiển thị | CPM/CPC | Khi đủ traffic (>50k user/tháng) | Tất cả |

### 3.6. Chi phí ước tính (năm đầu)
| Hạng mục | Chi phí |
|---|---|
| Domain | 0 đ (dùng chung domain với tool 1) |
| Hosting | 0 đ (dùng chung) |
| API calls sàn | 0 đ (đăng ký affiliate miễn phí) |
| Email/Telegram alert | 0 đ (free tier) |
| **Tổng thêm** | **0 đ** |

### 3.7. KPI thành công (6 tháng đầu)
- 5.000+ sản phẩm trong DB (từ 4 sàn chính)
- 5.000+ user đăng ký (free tier) — đa dạng persona (fresher + chủ shop + gia đình)
- 200+ premium user (49k–99k/tháng)
- 20+ chủ shop / dropshipper trả gói B2B (299k–799k/tháng)
- 100+ click affiliate/ngày
- Affiliate revenue: 3–8 triệu/tháng
- Premium + B2B revenue: 10–25 triệu/tháng
- **Tổng doanh thu Tool 2: 15–35 triệu/tháng** (nguồn thu chính)

---

## PHẦN 4 — NỀN TẢNG CHUNG (UMBRELLA BRAND)

### 4.1. Kiến trúc kỹ thuật (Monolith-first)

```
[Domain: toolify.vn (vd)]
       │
       ├── / (landing tổng)
       ├── /scholarships (Tool 1)
       ├── /price-compare (Tool 2)
       ├── /pricing (bảng giá chung)
       ├── /about
       └── /blog (SEO content)
```

**Giai đoạn đầu**: 1 Next.js app, 2 routes chính, dùng chung:
- Auth (Supabase Auth)
- Database (Supabase Postgres)
- Payment (PayOS + Stripe)
- Analytics (Plausible)

**Sau 6–12 tháng** nếu 1 tool scale lớn: tách thành sub-domain (vd: scholarships.toolify.vn) hoặc microservice riêng.

### 4.2. Công nghệ đề xuất (0 đ)
| Layer | Công cụ |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Hosting | Vercel (free tier) |
| Database | Supabase Postgres (500MB free) |
| Auth | Supabase Auth (free) |
| Scraper | Python (Playwright/BeautifulSoup) chạy trên GitHub Actions |
| Cron jobs | GitHub Actions (2000 phút/tháng free) |
| Thanh toán VN | PayOS |
| Thanh toán quốc tế | Stripe |
| Email | Resend (3k email/tháng free) |
| Notification | Telegram Bot API (free) |
| Analytics | Plausible Cloud (9$/mo) hoặc Umami self-host free |
| Error tracking | Sentry free tier |
| Domain | Namecheap ~150k/năm (.com) hoặc ~200k (.vn) |

### 4.3. Thương hiệu (Branding) — đề xuất

| Phương án | Phân tích |
|---|---|
| **Toolify.vn** | Ngắn, dễ nhớ, gợi ý "công cụ". Tên miền ~150k/năm |
| **Sotay.vn** (Sổ tay) | Gợi cảm giác tiện ích cá nhân |
| **HocNhe.vn** (Học nhẹ) | Gắn với giáo dục, sinh viên |
| **ReTi.vn** (Research-Tìm) | Gợi cảm giác tìm kiếm/tổng hợp |

**Gợi ý**: Bắt đầu với **Toolify.vn** (mang tính umbrella rõ ràng nhất). Đổi được nếu sau này thấy không hợp.

### 4.4. Marketing & Tăng trưởng (organic-first vì 0 đ)
| Kênh | Chiến thuật |
|---|---|
| **Facebook Group** | Chia sẻ trong group sinh viên, du học, mua sắm thông minh |
| **TikTok/Reels** | Video ngắn "so sánh giá", "học bổng bạn chưa biết" |
| **SEO blog** | Bài viết long-tail: "học bổng X deadline 2026", "so sánh giá laptop Y" |
| **Reddit/Telegram** | Chia sẻ trong cộng đồng phù hợp |
| **Referral** | Tặng 1 tháng premium khi giới thiệu bạn bè |
| **Product Hunt** | Khi ra mắt bản chính thức |

---

## PHẦN 5 — LỘ TRÌNH TRIỂN KHAI (12 TUẦN)

### Tuần 1–2: Xác Thực & Nền Tảng
- [ ] Phỏng vấn 10–15 sinh viên/fresher về 2 vấn đề (học bổng + mua sắm)
- [ ] Chốt tên thương hiệu + mua domain
- [ ] Setup Next.js + Supabase + Vercel
- [ ] Tạo landing page tổng giới thiệu 2 tool
- [ ] Đăng ký affiliate Shopee/Lazada/Tiki/Coursera

### Tuần 3–4: Tool 1 MVP
- [ ] Schema DB cho scholarship + course
- [ ] Nhập liệu thủ công 30 học bổng VN + 30 quốc tế + 50 khóa học
- [ ] Trang danh sách + bộ lọc
- [ ] Trang chi tiết
- [ ] Form đăng ký email alert
- [ ] Resend tích hợp gửi email

### Tuần 5–6: Tool 2 MVP
- [ ] Đăng ký API affiliate Shopee/Lazada/Tiki
- [ ] Viết script lấy sản phẩm + giá từ 3 API
- [ ] Trang nhập link → trả kết quả so sánh
- [ ] Lưu lịch sử giá (cron job hằng ngày)
- [ ] Form đăng ký alert giảm giá

### Tuần 7–8: Polish & Ra Mắt
- [ ] Auth + lưu danh sách yêu thích
- [ ] Submit link (cộng đồng đóng góp) cho cả 2 tool
- [ ] Telegram bot cho alert
- [ ] Viết 10 bài blog SEO đầu tiên
- [ ] Chia sẻ lên 5 group Facebook + TikTok

### Tuần 9–10: Thu Phí
- [ ] Tích hợp PayOS cho user VN
- [ ] Tạo gói premium (49k/tháng)
- [ ] Trang pricing rõ ràng
- [ ] Inbox 50 người đã dùng free hỏi feedback + offer premium

### Tuần 11–12: Đo Lường & Iterate
- [ ] Phân tích KPI: traffic, conversion, retention
- [ ] Phỏng vấn 5 user trả tiền
- [ ] Cập nhật tính năng theo feedback
- [ ] Lên kế hoạch tháng tiếp theo

---

## PHẦN 6 — PHÂN TÍCH RỦI RO & CÁCH GIẢM THIỂU

| Rủi ro | Xác suất | Tác động | Cách giảm thiểu |
|---|---|---|---|
| API sàn TMĐT thay đổi/gỡ | Trung bình | Cao | Đa dạng nguồn + cho phép user submit link thủ công |
| Bị Shopee/Lazada block IP | Thấp | Trung bình | Dùng API chính thức + Apify proxy |
| Scraping vi phạm ToS | Thấp | Trung bình | Rate limit + ghi credit + dùng API chính thức khi có |
| Affiliate commission thấp hơn kỳ vọng | Trung bình | Trung bình | Đa dạng doanh thu (premium + ads + B2B) |
| Không có user trả tiền | Trung bình | Cao | Validate với free tier trước khi xâng premium; thử nhiều mức giá |
| Đối thủ lớn copy | Thấm | Trung bình | Xây cộng đồng + niche cụ thể làm moat |
| Burnout do 1 người làm | Cao | Trung bình | Giữ scope MVP nhỏ, làm manual trước, chỉ automate khi đau |
| Thông tin sai/học bổng lừa đảo | Trung bình | Cao | Cộng đồng báo cáo + verify thủ công + disclaimer rõ |

---

## PHẦN 7 — BƯỚC TIẾP THEO NGAY HÔM NAY

1. **Phỏng vấn 5 sinh viên** trong tuần này — hỏi về 2 vấn đề:
   - Bạn đã tìm học bổng/khóa học như thế nào? Có khó khăn gì?
   - Khi mua đồ online bạn có so sánh giá không? Nếu có thì dùng cách gì?

2. **Chốt tên thương hiệu** — gợi ý Toolify.vn, nếu không thích có thể đổi

3. **Đăng ký affiliate** Shopee/Lazada/Tiki/Coursera (10–15 phút mỗi cái, free)

4. **Tạo landing page** đơn giản bằng Framer/Carrd (1–2 giờ)

Khi bạn sẵn sàng, mình sẽ giúp bạn:
- Viết **script phỏng vấn khách hàng** chi tiết
- Thiết kế **schema database** cho cả 2 tool
- Tạo **landing page** bằng no-code
- Cài đặt **Next.js + Supabase** skeleton

Bạn muốn bắt đầu từ bước nào trước?
