// Update Geneder

const User = require("../models/User");

exports.updateGender = async (req, res) => {
  const { id } = req.params;
  const { gender } = req.body;

  const updateGender = await User.findByIdAndUpdate(
    id,
    {
      gender,
    },
    {
      new: true,
    }
  );
  return res.json({ message: "Gender is updated successfuly" });
};

exports.updatebirthDate = async (req, res) => {
  const { id } = req.params;
  const { birthDate } = req.body;

  const updatebirthDate = await User.findByIdAndUpdate(id, {
    birthDate,
  });

  return res.json({ message: "BirthDate is updated successfuly" });
};
