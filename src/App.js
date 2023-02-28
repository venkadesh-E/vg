import "./App.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";

function App() {
  let formValue = {
    id: "",
    name: "",
    email: "",
    age: "",
    gender: "",
    error: {
      name: "",
      email: "",
      age: "",
      gender: "",
    },
  };
  const [formData, formUpdate] = useState(formValue);
  const [userData, userUpdate] = useState([]);
  useEffect(() => {
    async function getData() {
      const response = await axios.get(
        "https://63be4ee2f5cfc0949b5509d8.mockapi.io/users"
      );

      userUpdate(response.data);
    }
    getData();
  }, []);
  const handleChange = (e) => {
    let error = { ...formValue.error };
    if (e.target.value === "") {
      error[e.target.name] = `${e.target.name} is Required`;
    } else {
      error[e.target.name] = "";
    }
    formUpdate({ ...formData, [e.target.name]: e.target.value, error });
  };

  const onPopulate = (id) => {
    const selectData = userData.filter((row) => row.id === id)[0];
    formUpdate({ ...formData, ...selectData });
  };

  const handleDelete = async (id) => {
    const response = await axios.delete(
      `https://63be4ee2f5cfc0949b5509d8.mockapi.io/users/${id}`
    );
    console.log(response);
    const user = userData.filter((row) => row.id !== response.data.id);
    userUpdate(user);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorkeys = Object.keys(formData).filter((key) => {
      if (formData[key] === "" && key != "error" && key != "id") {
        return key;
      }
    });
    if (errorkeys.length >= 1) {
      alert("PLEASE FILL ALL FORMS");
    } else {
      if (formData.id) {
        //update
        const response = await axios.put(
          `https://63be4ee2f5cfc0949b5509d8.mockapi.io/users/${formData.id}`,
          {
            name: formData.name,
            email: formData.email,
            age: formData.age,
            gender: formData.gender,
          }
        );
        let user = [...userData];
        let index = user.findIndex((row) => row.id === response.data.id);
        user[index] = response.data;
        userUpdate(user);
      } else {
        //create
        const response = await axios.post(
          "https://63be4ee2f5cfc0949b5509d8.mockapi.io/users",
          {
            name: formData.name,
            email: formData.email,
            age: formData.age,
            gender: formData.gender,
          }
        );

        userUpdate([...userData, response.data]);
      }
      formUpdate(formValue);
    }
  };
  return (
    <div style={{ padding: "30px" }}>
      <h2>Formdata</h2>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={(e) => handleSubmit(e)}
      >
        <TextField
          id="name"
          label="Name"
          variant="standard"
          value={formData.name}
          name="name"
          onChange={(e) => handleChange(e)}
          required
        />
        <br />
        <span style={{ color: "red" }}>{formData.error.name}</span>

        <br />
        <TextField
          id="email"
          label="Email"
          type="email"
          variant="standard"
          value={formData.email}
          name="email"
          onChange={(e) => handleChange(e)}
          required
        />
        <br />
        <span style={{ color: "red" }}>{formData.error.email}</span>
        <br />
        <TextField
          id="age"
          label="Age"
          variant="standard"
          type="number"
          value={formData.age}
          name="age"
          onChange={(e) => handleChange(e)}
          required
        />
        <br />
        <span style={{ color: "red" }}>{formData.error.age}</span>
        <br />
        <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="Female"
          name="gender"
          onChange={(e) => handleChange(e)}
          required
          value={formData.gender}
        >
          <FormControlLabel value="Female" control={<Radio />} label="Female" />
          <FormControlLabel value="male" control={<Radio />} label="male" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
        <br />
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </Box>

      <h2>Userdata</h2>
      <TableContainer component={Paper}>
        <Table sx={{ width: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Age</TableCell>
              <TableCell align="right">Gender</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="right">{row.name}</TableCell>
                <TableCell align="right">{row.email}</TableCell>
                <TableCell align="right">{row.age}</TableCell>
                <TableCell align="right">{row.gender}</TableCell>
                <TableCell align="right">
                  <Button variant="text" onClick={() => onPopulate(row.id)}>
                    Update
                  </Button>
                  <br />
                  <Button variant="text" onClick={() => handleDelete(row.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;
