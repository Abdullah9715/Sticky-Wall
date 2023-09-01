import React, { useState, useEffect } from "react";
import { Form, Input, DatePicker, Modal, message, Button } from "antd";
import FormItem from "antd/es/form/FormItem";
import { AiOutlinePlus } from "react-icons/ai"; // Import the Plus icon
import dayjs from "dayjs";
import "./Stickwall.css"; // Import your CSS file
import { DeleteOutlined,EditOutlined } from "@ant-design/icons";

import { firestore } from "../Config/Config";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

const colorList = [
  "#ccd5ae",
  "#faedcd",
  "#d4a373",
  "#e9edc9",
  "#e3d5ca",
  "#fed9b7",
  "#ffbf69",
  "#15616d",
  "#ede0d4",
  "#eddea4",
  "#adb5bd",
  "#ccc5b9",
  "#eee4e1",
  "#e6beae",
  "#83c5be",
  "#bcb8b1",
  "#d9d9d9",
  "#d9dcd6",
  "#bfd8bd",
  "#ffe6a7",
  "#daf0ee",
  "#e0fbfc",
  "#b7b7a4",
  "#ddbea9",
  "#c6c5b9",
  "#7b9e89",
  "#efe6dd",
  "#efe5dc",
  "#cbbaa9",
  "#fde2e4",
  "#8d99ae",
  "#f9dcc4"
];


export default function Stickwall() {
  const [sticks, setSticks] = useState([]);
  const [modelVisible, setModelVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [editItemId, setEditItemId] = useState(null); 
  useEffect(() => {
    const fetchData = async () => {
      const sticksCollectionRef = collection(firestore, "Sticks");
      const sticksQuerySnapshot = await getDocs(sticksCollectionRef);
      const sticksData = [];
      
      sticksQuerySnapshot.forEach((doc) => {
        sticksData.push({ id: doc.id, ...doc.data() });
      });

      setSticks(sticksData);
    };

    fetchData();
  }, []);
  const openModal = () => {
    setModelVisible(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") {
      setTitle(value);
    } else if (name === "location") {
      setLocation(value);
    } else if (name === "description") {
      setDescription(value);
    }
  };

  const handleDateChange = (date) => {
    setDate(date);
  };

  const addStick = async () => {
    if (!title || !date || !location || !description) {
      return message.error("Check Something you missed");
    }

    const randomID = Math.random().toString(32).slice(2);
    const randomIndex = Math.floor(Math.random() * colorList.length);

    const newStickData = {
      title: title,
      date: date.toDate(),
      description: description,
      location: location,
      dateCreated: new Date(),
      bgcolor: colorList[randomIndex],
    };

    // Add the new stick data to Firestore collection and get the document reference
    const newStickRef = await addDoc(collection(firestore, "Sticks"), newStickData);

    // Fetch the newly created stick document to update the sticks array
    const newStickDocSnapshot = await getDoc(newStickRef);
    const newStickDocData = newStickDocSnapshot.data();

    // Update the local sticks state with the new stick data
    setSticks((prevSticks) => [...prevSticks, newStickDocData]);
    setModelVisible(false);
    setTitle("");
    setDate(null);
    setLocation("");
    setDescription("");
  };
  
  
  //delete card
  const deleteStick = async (stickId) => {
    await deleteDoc(doc(firestore, "Sticks", stickId));
    setSticks((prevSticks) => prevSticks.filter((stick) => stick.id !== stickId));
  };

  //Edit Card
    const handleEditClick = (card) => {
      setTitle(card.title);
      setDescription(card.description);
      setDate(dayjs(card.date.toDate()));
      setLocation(card.location);
      setEditItemId(card.id);
      setModelVisible(true);
    };
  return (
    <div className=" sticks-container">
      {sticks.map((card, i) => (
        <div style={{ backgroundColor: card.bgcolor, borderRadius: "10px" }} key={i}
          className="card p-3 m-2 fo  sticksCard col-md-3 col-sm-5 col-xl-2 col-xxl-1">
          
          <h5>{card.title}</h5>
          <p>
            <b>
              <u style={{color:'blue'}}>Date</u>
            </b>
          </p><p>{dayjs(card.date.toDate()).format("MM/DD/YYYY")}</p>
          <p>
            <b>
              <u style={{color:'blue'}}>Location</u>
            </b>
          </p>
          <p>{card.location}</p>
          <p>
            <b>
              <u style={{color:'blue'}}>Description</u>
            </b>
          </p>
          <p>{card.description}</p>

          <Button type="primary" icon={<EditOutlined />} style={{ marginLeft: "10px" }} onClick={() => handleEditClick(card)}></Button>
          <Button type="danger" icon={<DeleteOutlined />} style={{ color: "red" }}  onClick={() => deleteStick(card.id)}></Button>
        </div>
      ))}
      <button
        className="card sticksCard p-3 m-3 addButton col-md-3 col-sm-6 col-xl-2 col-xxl-1"onClick={openModal} >
       <AiOutlinePlus size={50}/>
      </button>
      <Modal
        title="Add Stick"
        visible={modelVisible}
        onCancel={() => setModelVisible(false)}
        onOk={addStick}
      >
        <Form>
          <FormItem>
            <Input
              placeholder="Title"
              value={title}
              onChange={handleChange}
              name="title"
            />
          </FormItem>
          <FormItem>
            <DatePicker
            placeholder="Date"
            value={date}
            onChange={handleDateChange}
            name="date"
            />
          </FormItem>

          <FormItem>
            <Input
              placeholder="Location"
              value={location}
              onChange={handleChange}
              name="location"
            />
          </FormItem>
          <FormItem>
            <Input
              placeholder="Description"
              value={description}
              onChange={handleChange}
              name="description"
            />
          </FormItem>
        </Form>
      </Modal>
    </div>
  )
}
