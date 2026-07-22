export const isValidTanzaniaPhone = (
  phone?: string | null
): boolean => {
  if (!phone) return false;

  const normalizedPhone = phone.replace(/\s+/g, "");

  return /^255\d{9}$/.test(normalizedPhone);
};