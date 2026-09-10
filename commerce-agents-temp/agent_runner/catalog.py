"""
agent_runner/catalog.py — Local Vietnamese product catalog.

Mirrors the 18 products from lib/storefront/vn-backend.ts so the Python
ShoppingAgent has the same canonical catalog without depending on TypeScript.
The Python session bootstraps from this module; the TypeScript path keeps its
own copy for the demo StorefrontBackend. The two stay in lockstep by hand.

Each entry is a plain dict with the keys the commerce-agents tools read
(product_id, title, brand, price, original_price, currency, rating,
review_count, image_url, category, labels, in_stock, short_description,
long_description, specs, options, store_prices).
"""

from __future__ import annotations

from typing import Any

CURRENCY = "VND"

# Synonym table mirrors VN_STOREFRONT (vn-backend.ts). Used by VNBackend to
# expand query tokens when searching local catalog.
_SYNONYMS: dict[str, list[str]] = {
    "điện thoại": ["smartphone", "đtdđ", "phone", "dien thoai"],
    "laptop": ["máy tính xách tay", "notebook", "macbook"],
    "tai nghe": ["headphone", "earphone", "buds", "tai nghe không dây"],
    "apple": ["iphone", "ipad", "macbook", "airpods", "apple watch"],
    "samsung": ["galaxy", "s24", "tab"],
    "máy tính bảng": ["tablet", "ipad", "galaxy tab"],
    "đồng hồ": ["smartwatch", "watch", "galaxy watch", "apple watch"],
    "phụ kiện": ["accessory", "charger", "chuột", "ssd"],
    "giá rẻ": ["bình dân", "tầm trung", "rẻ"],
    "cao cấp": ["premium", "flagship", "pro"],
    "chống ồn": ["anc", "noise cancelling", "khử ồn"],
}


CATALOG: list[dict[str, Any]] = [
    # ---- Điện thoại ----
    {
        "product_id": "iphone-15-128",
        "title": "iPhone 15 128GB - Chính hãng VN/A",
        "brand": "Apple",
        "price": 21_990_000,
        "original_price": 24_990_000,
        "currency": CURRENCY,
        "rating": 4.8,
        "review_count": 2847,
        "image_url": None,
        "category": "Điện thoại",
        "labels": ["Apple", "iPhone 15", "Chính hãng"],
        "in_stock": True,
        "short_description": "iPhone 15 màn hình Dynamic Island 6.1 inch, chip A16 Bionic, camera 48MP.",
        "long_description": (
            "iPhone 15 sở hữu màn hình Super Retina XDR 6.1 inch với Dynamic Island. "
            "Chip A16 Bionic cho hiệu năng vượt trội. Camera chính 48MP chụp ảnh sắc nét, "
            "quay video 4K HDR. Pin trâu, sạc USB-C nhanh."
        ),
        "specs": {
            "Màn hình": "6.1 inch Super Retina XDR",
            "Chip": "A16 Bionic",
            "RAM": "6GB",
            "Bộ nhớ": "128GB",
            "Camera sau": "48MP + 12MP",
            "Camera trước": "12MP",
            "Pin": "3349 mAh",
            "Sạc": "USB-C 20W",
        },
        "options": {},
        "store_prices": {"shopee": 21_490_000, "lazada": 22_190_000, "tiki": 21_990_000, "tiktok": 21_890_000},
    },
    {
        "product_id": "iphone-15-pro-256",
        "title": "iPhone 15 Pro 256GB - Chính hãng VN/A",
        "brand": "Apple",
        "price": 29_490_000,
        "original_price": 34_990_000,
        "currency": CURRENCY,
        "rating": 4.9,
        "review_count": 1523,
        "image_url": None,
        "category": "Điện thoại",
        "labels": ["Apple", "iPhone 15 Pro", "Titanium"],
        "in_stock": True,
        "short_description": "iPhone 15 Pro khung titanium, chip A17 Pro, camera 48MP Pro.",
        "long_description": (
            "iPhone 15 Pro với khung titanium grade 5 siêu bền. Chip A17 Pro 3nm mạnh nhất. "
            "Màn hình ProMotion 120Hz. Camera 48MP Pro với nhiều tuỳ chọn zoom quang học."
        ),
        "specs": {
            "Màn hình": "6.1 inch Super Retina XDR 120Hz",
            "Chip": "A17 Pro",
            "RAM": "8GB",
            "Bộ nhớ": "256GB",
            "Camera sau": "48MP + 12MP + 12MP",
            "Camera trước": "12MP",
            "Pin": "3274 mAh",
            "Sạc": "USB-C 27W",
        },
        "options": {},
        "store_prices": {"shopee": 28_990_000, "lazada": 29_490_000, "tiki": 29_290_000, "tiktok": 29_190_000},
    },
    {
        "product_id": "samsung-s24-ultra",
        "title": "Samsung Galaxy S24 Ultra 256GB",
        "brand": "Samsung",
        "price": 26_990_000,
        "original_price": 32_990_000,
        "currency": CURRENCY,
        "rating": 4.7,
        "review_count": 1892,
        "image_url": None,
        "category": "Điện thoại",
        "labels": ["Samsung", "Galaxy S24 Ultra", "Galaxy AI"],
        "in_stock": True,
        "short_description": "Samsung Galaxy S24 Ultra Galaxy AI, bút S Pen, camera 200MP.",
        "long_description": (
            "Galaxy S24 Ultra tích hợp Galaxy AI giúp dịch thuật real-time, tìm kiếm thông minh. "
            "Bút S Pen tích hợp. Camera 200MP chụp ảnh siêu nét. Màn hình 6.8 inch Dynamic AMOLED 2X."
        ),
        "specs": {
            "Màn hình": "6.8 inch Dynamic AMOLED 2X 120Hz",
            "Chip": "Snapdragon 8 Gen 3",
            "RAM": "12GB",
            "Bộ nhớ": "256GB",
            "Camera sau": "200MP + 50MP + 12MP + 10MP",
            "Camera trước": "12MP",
            "Pin": "5000 mAh",
            "Sạc": "USB-C 45W",
        },
        "options": {},
        "store_prices": {"shopee": 26_490_000, "lazada": 27_190_000, "tiki": 26_990_000, "tiktok": 26_790_000},
    },
    {
        "product_id": "xiaomi-14t-pro",
        "title": "Xiaomi 14T Pro - Dimensity 9300+",
        "brand": "Xiaomi",
        "price": 12_990_000,
        "original_price": 15_990_000,
        "currency": CURRENCY,
        "rating": 4.6,
        "review_count": 892,
        "image_url": None,
        "category": "Điện thoại",
        "labels": ["Xiaomi", "Giá tốt", "Camera Leica"],
        "in_stock": True,
        "short_description": "Xiaomi 14T Pro chip Dimensity 9300+, camera Leica 50MP.",
        "long_description": (
            "Xiaomi 14T Pro hợp tác với Leica cho camera 50MP chụp ảnh chuyên nghiệp. "
            "Chip Dimensity 9300+ mạnh mẽ. Màn hình AMOLED 6.67 inch 144Hz. Pin 5000mAh sạc nhanh 120W."
        ),
        "specs": {
            "Màn hình": "6.67 inch AMOLED 144Hz",
            "Chip": "Dimensity 9300+",
            "RAM": "12GB",
            "Bộ nhớ": "256GB",
            "Camera sau": "50MP Leica + 50MP + 12MP",
            "Camera trước": "32MP",
            "Pin": "5000 mAh",
            "Sạc": "120W HyperCharge",
        },
        "options": {},
        "store_prices": {"shopee": 12_490_000, "lazada": 12_990_000, "tiki": 12_790_000, "tiktok": 12_590_000},
    },

    # ---- Laptop ----
    {
        "product_id": "macbook-air-m3-13",
        "title": "MacBook Air M3 13 inch 8GB/256GB",
        "brand": "Apple",
        "price": 27_990_000,
        "original_price": 31_990_000,
        "currency": CURRENCY,
        "rating": 4.9,
        "review_count": 3241,
        "image_url": None,
        "category": "Laptop",
        "labels": ["Apple", "MacBook Air", "M3", "Siêu mỏng"],
        "in_stock": True,
        "short_description": "MacBook Air M3 13 inch — chip Apple M3, mỏng nhẹ, pin 18h.",
        "long_description": (
            "MacBook Air M3 với chip Apple M3 8-core GPU, tiết kiệm điện vượt trội. "
            "Màn hình Liquid Retina 13.6 inch sắc nét. Pin lên đến 18 giờ. "
            "Vỏ nhôm tái chế, siêu mỏng 1.13cm."
        ),
        "specs": {
            "Màn hình": "13.6 inch Liquid Retina",
            "Chip": "Apple M3 8-core",
            "GPU": "8-core",
            "RAM": "8GB",
            "Bộ nhớ": "256GB SSD",
            "Pin": "52.6Wh (~18 giờ)",
            "Cổng": "MagSafe 3, 2x Thunderbolt",
            "Trọng lượng": "1.24 kg",
        },
        "options": {},
        "store_prices": {"shopee": 27_490_000, "lazada": 27_990_000, "tiki": 27_790_000, "tiktok": 27_690_000},
    },
    {
        "product_id": "dell-inspiron-15-3520",
        "title": "Dell Inspiron 15 3520 i5-1235U/8GB/512GB",
        "brand": "Dell",
        "price": 15_490_000,
        "original_price": 19_990_000,
        "currency": CURRENCY,
        "rating": 4.5,
        "review_count": 1203,
        "image_url": None,
        "category": "Laptop",
        "labels": ["Dell", "Inspiron", "Văn phòng", "Office"],
        "in_stock": True,
        "short_description": "Laptop Dell Inspiron 15 văn phòng, chip Intel thế hệ 12.",
        "long_description": (
            "Dell Inspiron 15 3520 phù hợp văn phòng, học tập. Chip Intel Core i5-1235U thế hệ 12, "
            "RAM 8GB, SSD 512GB. Màn hình 15.6 inch FHD. Bàn phím số đầy đủ."
        ),
        "specs": {
            "Màn hình": "15.6 inch FHD IPS",
            "Chip": "Intel Core i5-1235U",
            "RAM": "8GB DDR4",
            "Bộ nhớ": "512GB SSD",
            "Card đồ hoạ": "Intel Iris Xe",
            "Pin": "54Wh",
            "Cổng": "USB-C, 2x USB-A, HDMI, SD",
            "Trọng lượng": "1.9 kg",
        },
        "options": {},
        "store_prices": {"shopee": 14_990_000, "lazada": 15_490_000, "tiki": 15_290_000, "tiktok": 15_190_000},
    },
    {
        "product_id": "asus-rog-strix-g16",
        "title": "ASUS ROG Strix G16 G614JZR i9/16GB/1TB RTX4070",
        "brand": "ASUS",
        "price": 42_990_000,
        "original_price": 54_990_000,
        "currency": CURRENCY,
        "rating": 4.7,
        "review_count": 567,
        "image_url": None,
        "category": "Laptop",
        "labels": ["ASUS", "ROG", "Gaming", "RTX 4070"],
        "in_stock": True,
        "short_description": "Laptop gaming ASUS ROG Strix G16 — RTX 4070, chip i9 thế hệ 14.",
        "long_description": (
            "ROG Strix G16 gaming khủng với RTX 4070 8GB, chip Intel Core i9-14900HX. "
            "Màn hình 16 inch 165Hz G-Sync. Hệ thống tản nhiệt AAS giữ máy mát khi chơi game nặng. "
            "RGB per-key."
        ),
        "specs": {
            "Màn hình": "16 inch FHD 165Hz G-Sync",
            "Chip": "Intel Core i9-14900HX",
            "RAM": "16GB DDR5",
            "Bộ nhớ": "1TB SSD",
            "Card đồ hoạ": "NVIDIA RTX 4070 8GB",
            "Pin": "90Wh",
            "Tản nhiệt": "ROG Intelligent Cooling",
            "Trọng lượng": "2.5 kg",
        },
        "options": {},
        "store_prices": {"shopee": 41_990_000, "lazada": 42_990_000, "tiki": 42_490_000, "tiktok": 42_790_000},
    },

    # ---- Tai nghe ----
    {
        "product_id": "airpods-pro-2",
        "title": "AirPods Pro 2 USB-C - Chính hãng",
        "brand": "Apple",
        "price": 6_490_000,
        "original_price": 7_990_000,
        "currency": CURRENCY,
        "rating": 4.8,
        "review_count": 4521,
        "image_url": None,
        "category": "Tai nghe",
        "labels": ["Apple", "AirPods Pro", "Chống ồn", "USB-C"],
        "in_stock": True,
        "short_description": "AirPods Pro 2 với USB-C, chống ồn chủ động, spatial audio.",
        "long_description": (
            "AirPods Pro 2 USB-C với chip H2 cho chất lượng âm thanh vượt trội. "
            "Chống ồn chủ động gấp 2 lần thế hệ trước. Chế độ Adaptive Audio. "
            "Spatial Audio cá nhân hoá. Pin 6h, hộp sạc 30h."
        ),
        "specs": {
            "Chip": "Apple H2",
            "Chống ồn": "Active Noise Cancellation",
            "Chế độ": "Transparency, Adaptive",
            "Pin tai nghe": "6 giờ",
            "Pin hộp sạc": "30 giờ",
            "Kết nối": "Bluetooth 5.3",
            "Sạc": "USB-C, MagSafe, Qi",
            "Chống nước": "IPX4",
        },
        "options": {},
        "store_prices": {"shopee": 6_190_000, "lazada": 6_490_000, "tiki": 6_390_000, "tiktok": 6_290_000},
    },
    {
        "product_id": "sony-wh-1000xm5",
        "title": "Sony WH-1000XM5 - Tai nghe chống ồn",
        "brand": "Sony",
        "price": 7_990_000,
        "original_price": 10_990_000,
        "currency": CURRENCY,
        "rating": 4.8,
        "review_count": 2103,
        "image_url": None,
        "category": "Tai nghe",
        "labels": ["Sony", "1000X", "Chống ồn", "Over-ear"],
        "in_stock": True,
        "short_description": "Sony WH-1000XM5 — tai nghe over-ear chống ồn tốt nhất.",
        "long_description": (
            "Sony WH-1000XM5 với driver 30mm thiết kế mới, chống ồn vượt trội. "
            "8 micro giảm tiếng ồn. LDAC cho âm thanh Hi-Res. Pin 30h. Trọng lượng chỉ 250g."
        ),
        "specs": {
            "Driver": "30mm",
            "Chống ồn": "Auto NC Optimizer",
            "Pin": "30 giờ (NC on)",
            "Sạc": "USB-C (3.5 giờ sạc đầy)",
            "Kết nối": "Bluetooth 5.2, LDAC, AAC",
            "Trọng lượng": "250g",
            "Micro": "4 beamforming + 1 feedback",
            "Tính năng": "Speak-to-Chat, Multipoint",
        },
        "options": {},
        "store_prices": {"shopee": 7_490_000, "lazada": 7_990_000, "tiki": 7_790_000, "tiktok": 7_590_000},
    },

    # ---- Máy tính bảng ----
    {
        "product_id": "ipad-pro-m4-11",
        "title": "iPad Pro 11 inch M4 256GB - WiFi",
        "brand": "Apple",
        "price": 24_990_000,
        "original_price": 28_990_000,
        "currency": CURRENCY,
        "rating": 4.9,
        "review_count": 1087,
        "image_url": None,
        "category": "Máy tính bảng",
        "labels": ["Apple", "iPad Pro", "M4", "OLED"],
        "in_stock": True,
        "short_description": "iPad Pro M4 11 inch — chip M4, OLED Ultra Retina XDR.",
        "long_description": (
            "iPad Pro M4 11 inch với chip M4 10-core GPU cho hiệu năng vượt trội. "
            "Màn hình Ultra Retina XDR OLED. Apple Pencil Pro, Magic Keyboard tương thích. "
            "WiFi 6E, kết nối nhanh."
        ),
        "specs": {
            "Màn hình": "11 inch Ultra Retina XDR OLED",
            "Chip": "Apple M4",
            "RAM": "8GB",
            "Bộ nhớ": "256GB",
            "Camera sau": "12MP + 10MP",
            "Camera trước": "12MP Ultra Wide",
            "Pin": "~10 giờ",
            "Cổng": "Thunderbolt / USB 4",
        },
        "options": {},
        "store_prices": {"shopee": 24_490_000, "lazada": 24_990_000, "tiki": 24_790_000, "tiktok": 24_690_000},
    },
    {
        "product_id": "samsung-tab-s9-fe",
        "title": "Samsung Galaxy Tab S9 FE 128GB",
        "brand": "Samsung",
        "price": 9_490_000,
        "original_price": 12_990_000,
        "currency": CURRENCY,
        "rating": 4.6,
        "review_count": 743,
        "image_url": None,
        "category": "Máy tính bảng",
        "labels": ["Samsung", "Galaxy Tab", "Galaxy Tab S9"],
        "in_stock": True,
        "short_description": "Samsung Galaxy Tab S9 FE — tablet Android tầm trung, S Pen.",
        "long_description": (
            "Galaxy Tab S9 FE màn hình 10.9 inch IPS LCD sắc nét. Chip Exynos 1380. "
            "S Pen đi kèm viết vẽ thoải mái. Pin 8000mAh, sạc nhanh 45W. Chuẩn IP68."
        ),
        "specs": {
            "Màn hình": "10.9 inch TFT LCD",
            "Chip": "Exynos 1380",
            "RAM": "6GB",
            "Bộ nhớ": "128GB",
            "Camera sau": "8MP",
            "Camera trước": "12MP",
            "Pin": "8000 mAh",
            "S Pen": "Có (trong hộp)",
        },
        "options": {},
        "store_prices": {"shopee": 9_190_000, "lazada": 9_490_000, "tiki": 9_390_000, "tiktok": 9_290_000},
    },

    # ---- Đồng hồ thông minh ----
    {
        "product_id": "apple-watch-s9-45",
        "title": "Apple Watch Series 9 45mm GPS - Midnight",
        "brand": "Apple",
        "price": 10_990_000,
        "original_price": 13_990_000,
        "currency": CURRENCY,
        "rating": 4.8,
        "review_count": 3210,
        "image_url": None,
        "category": "Đồng hồ thông minh",
        "labels": ["Apple", "Apple Watch", "Series 9", "Health"],
        "in_stock": True,
        "short_description": "Apple Watch Series 9 — chip S9, màn hình Always-On Retina.",
        "long_description": (
            "Apple Watch Series 9 với chip S9 SiP cho hiệu năng nhanh hơn. "
            "Màn hình Always-On Retina 45mm sáng hơn. Cảm biến sức khoẻ: nhịp tim, SpO2, ECG. "
            "Định vị chính xác Double Tap."
        ),
        "specs": {
            "Màn hình": "45mm Always-On Retina",
            "Chip": "Apple S9 SiP",
            "Chống nước": "50m WR",
            "Pin": "~18 giờ",
            "GPS": "Có",
            "Cảm biến": "Nhịp tim, SpO2, ECG",
            "Sạc": "Magnetic sạc nhanh",
        },
        "options": {},
        "store_prices": {"shopee": 10_490_000, "lazada": 10_990_000, "tiki": 10_790_000, "tiktok": 10_690_000},
    },
    {
        "product_id": "galaxy-watch-6-44",
        "title": "Samsung Galaxy Watch 6 44mm",
        "brand": "Samsung",
        "price": 6_990_000,
        "original_price": 9_990_000,
        "currency": CURRENCY,
        "rating": 4.5,
        "review_count": 1456,
        "image_url": None,
        "category": "Đồng hồ thông minh",
        "labels": ["Samsung", "Galaxy Watch 6", "WearOS"],
        "in_stock": True,
        "short_description": "Samsung Galaxy Watch 6 — WearOS, theo dõi sức khoẻ toàn diện.",
        "long_description": (
            "Galaxy Watch 6 chạy WearOS by Google. Màn hình Super AMOLED 44mm cong tràn viền. "
            "Đo nhịp tim, SpO2, BMI, áp suất. Theo dõi giấc ngủ. Tích hợp Bixby."
        ),
        "specs": {
            "Màn hình": "44mm Super AMOLED",
            "Chip": "Exynos W930",
            "RAM": "2GB",
            "Bộ nhớ": "16GB",
            "Pin": "425mAh (~40 giờ)",
            "Hệ điều hành": "WearOS 4",
            "Chống nước": "5ATM + IP68",
            "GPS": "Có",
        },
        "options": {},
        "store_prices": {"shopee": 6_690_000, "lazada": 6_990_000, "tiki": 6_890_000, "tiktok": 6_790_000},
    },

    # ---- Phụ kiện ----
    {
        "product_id": "anker-737-charger",
        "title": "Anker 737 GaNPrime 120W - Sạc nhanh 3 cổng",
        "brand": "Anker",
        "price": 1_990_000,
        "original_price": 2_990_000,
        "currency": CURRENCY,
        "rating": 4.7,
        "review_count": 2341,
        "image_url": None,
        "category": "Phụ kiện",
        "labels": ["Anker", "GaN", "Sạc nhanh", "120W"],
        "in_stock": True,
        "short_description": "Anker GaNPrime 120W sạc nhanh 3 thiết bị cùng lúc.",
        "long_description": (
            "Anker 737 GaNPrime 120W dùng công nghệ GaN tiết kiệm năng lượng, nhỏ gọn. "
            "3 cổng: 2 USB-C PD 100W + 1 USB-A 22.5W. Sạc laptop, điện thoại, tablet cùng lúc. "
            "AI Power sмарт điều chỉnh dòng."
        ),
        "specs": {
            "Công suất": "120W",
            "Cổng": "2x USB-C PD + 1x USB-A",
            "Công nghệ": "GaN III, AI Power",
            "Kích thước": "80 x 80 x 35 mm",
            "Trọng lượng": "250g",
            "Bảo vệ": "Over-voltage, Over-temperature",
        },
        "options": {},
        "store_prices": {"shopee": 1_790_000, "lazada": 1_990_000, "tiki": 1_890_000, "tiktok": 1_690_000},
    },
    {
        "product_id": "logitech-mx-master-3s",
        "title": "Logitech MX Master 3S - Chuột không dây",
        "brand": "Logitech",
        "price": 3_490_000,
        "original_price": 4_490_000,
        "currency": CURRENCY,
        "rating": 4.8,
        "review_count": 3872,
        "image_url": None,
        "category": "Phụ kiện",
        "labels": ["Logitech", "MX Master", "Chuột cao cấp", "Ergonomic"],
        "in_stock": True,
        "short_description": "Logitech MX Master 3S — chuột ergonomic cao cấp, im lặng.",
        "long_description": (
            "MX Master 3S với cảm biến 8000 DPI chính xác. Cuộn MagSpeed siêu nhanh. "
            "Clic không tiếng động. Kết nối 3 thiết bị Easy-Switch. Tương thích macOS, Windows, Linux."
        ),
        "specs": {
            "Cảm biến": "8000 DPI",
            "Nút": "7 nút có thể tuỳ chỉnh",
            "Kết nối": "Bluetooth + USB Receiver",
            "Pin": "70 ngày (sạc USB-C)",
            "Tương thích": "Windows, macOS, Linux",
            "Trọng lượng": "141g",
        },
        "options": {},
        "store_prices": {"shopee": 3_290_000, "lazada": 3_490_000, "tiki": 3_390_000, "tiktok": 3_290_000},
    },
    {
        "product_id": "sandisk-1tb-ssd",
        "title": "SanDisk Extreme Pro 1TB SSD - Đọc 2000MB/s",
        "brand": "SanDisk",
        "price": 2_490_000,
        "original_price": 3_990_000,
        "currency": CURRENCY,
        "rating": 4.7,
        "review_count": 1893,
        "image_url": None,
        "category": "Ổ cứng",
        "labels": ["SanDisk", "SSD", "NVMe", "1TB"],
        "in_stock": True,
        "short_description": "SanDisk Extreme Pro 1TB — SSD NVMe di động, tốc độ 2000MB/s.",
        "long_description": (
            "SanDisk Extreme Pro Portable SSD 1TB với tốc độ đọc 2000MB/s, ghi 2000MB/s "
            "qua USB 3.2 Gen 2. Chống nước, chống bụi IP55. Mã hoá AES 256-bit. Nhỏ gọn bỏ túi."
        ),
        "specs": {
            "Dung lượng": "1TB",
            "Đọc": "2000 MB/s",
            "Ghi": "2000 MB/s",
            "Kết nối": "USB-C 3.2 Gen 2",
            "Bảo vệ": "IP55, Mã hoá AES-256",
            "Trọng lượng": "76g",
            "Kích thước": "110 x 57 x 10 mm",
        },
        "options": {},
        "store_prices": {"shopee": 2_290_000, "lazada": 2_490_000, "tiki": 2_390_000, "tiktok": 2_290_000},
    },

    # ---- Thời trang ----
    {
        "product_id": "ao-thun-uniqlo-ut",
        "title": "Uniqlo UT Anime T-Shirt - Size M-XXL",
        "brand": "Uniqlo",
        "price": 199_000,
        "original_price": 299_000,
        "currency": CURRENCY,
        "rating": 4.6,
        "review_count": 8921,
        "image_url": None,
        "category": "Thời trang",
        "labels": ["Uniqlo", "UT", "T-Shirt", "Anime"],
        "in_stock": True,
        "short_description": "Uniqlo UT in hình anime — chất vải cotton 100%, mềm mại.",
        "long_description": (
            "Áo thun Uniqlo UT in hình anime chất liệu 100% cotton mềm mại, thoáng mát. "
            "Form regular fit phù hợp mọi người. Size từ M đến XXL. Nhiều mẫu anime hot."
        ),
        "specs": {
            "Chất liệu": "100% Cotton",
            "Form": "Regular Fit",
            "Size": "M, L, XL, XXL",
            "Cổ áo": "Tròn",
            "Xuất xứ": "Made in Vietnam",
        },
        "options": {},
        "store_prices": {"shopee": 179_000, "lazada": 199_000, "tiki": 189_000, "tiktok": 169_000},
    },

    # ---- Sách ----
    {
        "product_id": "sach-dac-nhanh-tam",
        "title": "Đắc Nhân Tâm - Dale Carnegie (Bìa Cứng)",
        "brand": "Nhã Nam",
        "price": 89_000,
        "original_price": 149_000,
        "currency": CURRENCY,
        "rating": 4.9,
        "review_count": 12_453,
        "image_url": None,
        "category": "Sách",
        "labels": ["Sách", "Kỹ năng sống", "Bestseller"],
        "in_stock": True,
        "short_description": "Đắc Nhân Tâm — Dale Carnegie, bìa cứng, bestseller thế giới.",
        "long_description": (
            "Đắc Nhân Tâm của Dale Carnegie là cuốn sách kỹ năng sống nổi tiếng nhất mọi thời đại. "
            "Phiên bản bìa cứng, giấy chất lượng cao. Dịch giả uy tín."
        ),
        "specs": {
            "Tác giả": "Dale Carnegie",
            "Dịch giả": "Trần Bảo Khoa",
            "Nhà xuất bản": "Nhã Nam",
            "Số trang": "320",
            "Khổ": "14 x 20.5 cm",
            "Bìa": "Cứng",
        },
        "options": {},
        "store_prices": {"shopee": 79_000, "lazada": 89_000, "tiki": 85_000, "tiktok": 75_000},
    },
]

# VN policies (mirror vn-backend.ts).
POLICIES: list[dict[str, Any]] = [
    {
        "policy_id": "shipping",
        "title": "Chính sách vận chuyển",
        "category": "Vận chuyển",
        "content": (
            "Giao hàng toàn quốc từ 2-5 ngày làm việc. Miễn phí vận chuyển cho đơn hàng từ 0đ "
            "(tất cả các sản phẩm). Hỗ trợ giao hàng nhanh 1-2 ngày với phụ phí. "
            "Theo dõi đơn hàng real-time qua SMS và ứng dụng."
        ),
    },
    {
        "policy_id": "return",
        "title": "Chính sách đổi trả 7 ngày",
        "category": "Đổi trả",
        "content": (
            "Đổi trả miễn phí trong 7 ngày nếu sản phẩm bị lỗi từ nhà sản xuất, không đúng mô tả, "
            "hoặc giao sai. Sản phẩm phải còn nguyên vẹn, chưa qua sử dụng, còn đầy đủ phụ kiện và hộp. "
            "Không áp dụng đổi trả với sản phẩm cá nhân hoá."
        ),
    },
    {
        "policy_id": "warranty",
        "title": "Bảo hành chính hãng",
        "category": "Bảo hành",
        "content": (
            "Sản phẩm chính hãng được bảo hành theo chính sách của nhà sản xuất: "
            "Apple 12 tháng, Samsung 12 tháng, Sony 12 tháng, Xiaomi 12 tháng, Logitech 24 tháng. "
            "Bảo hành tại trung tâm bảo hành ủy quyền trên toàn quốc."
        ),
    },
    {
        "policy_id": "payment",
        "title": "Phương thức thanh toán",
        "category": "Thanh toán",
        "content": (
            "Thanh toán COD (nhận hàng rồi trả tiền), chuyển khoản, thẻ tín dụng/ghi nợ quốc tế "
            "(Visa, Mastercard, JCB), ví điện tử (MoMo, ZaloPay, VNPay). Không phụ thu phí thanh toán."
        ),
    },
    {
        "policy_id": "fake",
        "title": "Cam kết 100% chính hãng",
        "category": "Cam kết",
        "content": (
            "Cam kết 100% sản phẩm chính hãng từ nhà phân phối ủy quyền. "
            "Hoàn tiền gấp 10 lần nếu phát hiện hàng giả, hàng nhái. "
            "Hóa đơn VAT available cho doanh nghiệp."
        ),
    },
]


def _expand_tokens(tokens: list[str]) -> list[str]:
    """Lowercase and broaden query tokens via the synonym table."""
    out: set[str] = {t.lower() for t in tokens}
    for token in tokens:
        t = token.lower()
        for base, syns in _SYNONYMS.items():
            if t == base or t in syns:
                out.add(base)
                out.update(syns)
    return list(out)


_SEARCH_WEIGHTS = {
    "title": 3.0,
    "brand": 2.0,
    "category": 1.5,
    "labels": 1.0,
    "short_description": 0.5,
}


def _score(entry: dict[str, Any], tokens: list[str]) -> float:
    searchable = {
        "title": (entry.get("title") or "").lower(),
        "brand": (entry.get("brand") or "").lower(),
        "category": (entry.get("category") or "").lower(),
        "labels": " ".join(str(label).lower() for label in entry.get("labels", [])),
        "short_description": (entry.get("short_description") or "").lower(),
    }
    s = 0.0
    for token in tokens:
        for field, text in searchable.items():
            if text and token in text:
                s += _SEARCH_WEIGHTS.get(field, 1.0)
    return s


def search_local(
    query: str, limit: int = 8, min_price: float | None = None, max_price: float | None = None
) -> list[dict[str, Any]]:
    """Score-and-rank local catalog. Mirrors VN storefront search in
    lib/storefront/vn-backend.ts so the Python session returns the same picks."""
    tokens = _expand_tokens(query.split())
    if not tokens:
        return []
    scored: list[tuple[float, dict[str, Any]]] = []
    for entry in CATALOG:
        score = _score(entry, tokens)
        if score > 0:
            scored.append((score, entry))
    scored.sort(key=lambda pair: pair[0], reverse=True)
    out: list[dict[str, Any]] = []
    for _, entry in scored:
        if min_price is not None and entry["price"] < min_price:
            continue
        if max_price is not None and entry["price"] > max_price:
            continue
        out.append(_product_summary(entry))
        if len(out) >= limit:
            break
    return out


def _product_summary(entry: dict[str, Any]) -> dict[str, Any]:
    """Strip long-form fields; matches lib/storefront Product shape."""
    return {
        "product_id": entry["product_id"],
        "title": entry["title"],
        "brand": entry.get("brand"),
        "price": entry["price"],
        "original_price": entry.get("original_price"),
        "currency": entry.get("currency", CURRENCY),
        "rating": entry.get("rating"),
        "review_count": entry.get("review_count"),
        "image_url": entry.get("image_url"),
        "category": entry.get("category"),
        "labels": list(entry.get("labels", [])),
        "in_stock": entry.get("in_stock", True),
        "short_description": entry.get("short_description"),
    }


def find_product(product_id: str) -> dict[str, Any] | None:
    """Return the full catalog record (with specs, store_prices, long_description)."""
    for entry in CATALOG:
        if entry["product_id"] == product_id:
            return entry
    return None


def find_policy(query: str) -> list[dict[str, Any]]:
    """Return policies whose title/category/content contains ``query`` (case-insensitive)."""
    if not query or not query.strip():
        return list(POLICIES)
    q = query.lower()
    return [
        policy
        for policy in POLICIES
        if q in policy["title"].lower()
        or q in (policy.get("category") or "").lower()
        or q in policy["content"].lower()
    ]
