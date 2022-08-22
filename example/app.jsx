import React, { useEffect, useState } from "react";
import axios from "axios";

const URL = "/api/list";
const App = () => {
  const [value, setValue] = useState("");
  const [res, setRes] = useState("");
  const onInputChange = (e) => {
    setValue(e.target.value);
  };
  useEffect(() => {
    fecthData();
  }, []);
  const fecthData = () => {
    axios.get(URL, { params: { id: value } }).then((res) => {
      if (res.data.code == 0) {
        setRes(JSON.stringify(res.data));
      }
    });
  };
  return (
    <div style={{ padding: "20px 100px" }}>
      <h1>Demo</h1>
      <div>
        <input
          value={value}
          onChange={onInputChange}
          placeholder="please enter id"
        />
        <button onClick={fecthData} style={{ margin: "20px" }}>
          Query
        </button>
        <span style={{ fontSize: 12, color: "#666" }}>
          You can enter different id or edit ./mock/index.js, and click the
          query button
        </span>
      </div>
      <textarea
        defaultValue={res}
        cols={10}
        style={{ width: 400, minHeight: 200 }}
      ></textarea>
    </div>
  );
};

export default App;
