/**
 * Chuyển đổi số có 1 chữ số (1-9) thành số có 2 chữ số (01-09) trong chuỗi
 * Ví dụ: "Phường 1" -> "Phường 01", "Xã 9" -> "Xã 09", "Đường 5" -> "Đường 05"
 * 
 * @param str - Chuỗi cần xử lý
 * @returns Chuỗi đã được chuyển đổi
 */
export const formatWardName = (str: string | null | undefined): string => {
  if (!str) return "";

  // Regex để tìm tất cả các số có 1 chữ số (1-9) đơn lẻ
  // Sử dụng lookbehind và lookahead để đảm bảo số đó không nằm trong một số lớn hơn
  const pattern = /(?<!\d)([1-9])(?!\d)/g;

  return str.replace(pattern, (match, number) => {
    // Thêm số 0 đằng trước số có 1 chữ số (1-9)
    return `0${number}`;
  });
};

