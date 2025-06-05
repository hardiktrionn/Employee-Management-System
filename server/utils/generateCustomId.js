const Counter = require("../schema/counterSchema");

const generateCustomId = async (typePrefix, counterKey) => {
  const counter = await Counter.findByIdAndUpdate(
    { _id: counterKey },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return `${typePrefix}${counter.seq}`;
};

module.exports = generateCustomId;
