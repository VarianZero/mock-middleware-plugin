const list = [
  { id: 1, name: "js" },
  { id: 2, name: "json" },
  { id: 3, name: "react" },
];

module.exports = {
  "/api/list": (req, res) => {
    const { id } = req.query;
    res.send({
      code: 0,
      msg: "",
      data: id ? list.filter((e) => e.id == id) : list,
    });
  },
};
