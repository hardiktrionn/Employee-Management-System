// Generate the unique employee id
const generateCustomId = () => {
  const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
  return `EMP-${randomNumber}`;
};

export default generateCustomId;
