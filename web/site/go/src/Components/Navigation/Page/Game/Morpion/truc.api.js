export const postTruc = async () => {
  const response = await fetch("/api/truc", {...});
  return response.json();
};


// exports.rootTruc = async (req, res) => {
//   const msg = req.body.message;
//   res.status(201).json({ success: true, message: "maman" + msg });
// };