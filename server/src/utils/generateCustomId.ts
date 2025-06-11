import Counter from "../schema/counterSchema";

// Generate the unique employee id
const generateCustomId = async (
  typePrefix: string,
  counterKey: string
): Promise<string> => {
  const counter = await Counter.findByIdAndUpdate(
    counterKey,
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  if (!counter) {
    throw new Error("Failed to generate ID");
  }

  return `${typePrefix}${counter.seq}`;
};

export default generateCustomId;
