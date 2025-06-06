// utils/formatTime.ts
const formatTime = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "";

  const istDate = new Date(dateStr).toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return istDate;
};

export default formatTime;
