// =====================================================================
// localStorage helpers — typed, SSR-safe, tự seed khi trống.
// Mọi dữ liệu mock (users, products, votes, ...) đi qua đây.
// Khi chuyển sang Supabase: chỉ cần thay phần implementation, giữ nguyên
// chữ ký hàm → các trang không cần đổi.
// =====================================================================

const isBrowser = () => typeof window !== 'undefined';

/**
 * Đọc một key từ localStorage. Nếu trống thì gọi `seed()` để tạo dữ liệu mặc định
 * và lưu lại. Trả về `fallback` nếu có lỗi parse.
 */
export function readStorage<T>(key: string, seed: () => T, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      const value = seed();
      window.localStorage.setItem(key, JSON.stringify(value));
      return value;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Ghi một key vào localStorage. Không làm gì nếu đang ở SSR. */
export function writeStorage<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Bỏ qua (private mode / quota)
  }
}

/** Xóa một key. */
export function removeStorage(key: string): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(key);
}

/**
 * Đảm bảo seed tồn tại trong localStorage. Dùng cho users: luôn giữ
 * tài khoản admin mặc định, kể cả khi user khác xoá nhầm.
 */
export function ensureSeed<T extends { email?: string }>(
  key: string,
  seedItem: T,
  predicate: (item: T) => boolean = (i) => i.email === seedItem.email
): T[] {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(key);
  let list: T[] = [];
  if (raw) {
    try {
      list = JSON.parse(raw) as T[];
    } catch {
      list = [];
    }
  }
  if (!list.some(predicate)) {
    list = [seedItem, ...list];
    window.localStorage.setItem(key, JSON.stringify(list));
  }
  return list;
}