const formatISODate = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);
  const options = { day: "2-digit", month: "short", year: "numeric" };

  return date.toLocaleDateString("en-GB", options).replace(/ /g, "-");
};

export default formatISODate