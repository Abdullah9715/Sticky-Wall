import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import dayjs from "dayjs";
import { firestore } from "../Config/Config";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import '../Frontend/Stickwall.css';

export default function Upcomming() {
  const [allSticks, setAllSticks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const sticksCollectionRef = collection(firestore, "Sticks");
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayQuery = query(
        sticksCollectionRef,
        where("dateCreated", ">=", today)
      );

      const todayQuerySnapshot = await getDocs(todayQuery);
      const todaySticksData = todayQuerySnapshot.docs.map((doc) => doc.id);

      const allQuery = query(sticksCollectionRef);

      const allQuerySnapshot = await getDocs(allQuery);
      const allSticksData = allQuerySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const filteredSticksData = allSticksData.filter((stick) => !todaySticksData.includes(stick.id));

      console.log("Fetched Data:", filteredSticksData); // Log the fetched data for debugging

      setAllSticks(filteredSticksData);
    };

    fetchData();
  }, []);
  const deleteStick = async (stickId) => {
    try {
      await deleteDoc(doc(firestore, "Sticks", stickId));
      setAllSticks((prevSticks) =>
        prevSticks.filter((stick) => stick.id !== stickId)
      );
    } catch (error) {
      console.error("Error deleting stick:", error);
    }
  };


  return (
    <div className="sticks-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>
      <h1 style={{ width: '100%', textAlign: 'center' }}>All Sticks (Excluding Today)</h1>
      <div style={{ width: '100%' }}>
        {allSticks.map((card, i) => (
          <div
            key={i}
            style={{ backgroundColor: card.bgcolor, borderRadius: '10px' }}
            className="card p-3 m-2 sticksCard col-md-3 col-sm-5 col-xl-2 col-xxl-1"
          >
            <h5>{card.title}</h5>
            <p>
              <b>
                <u>Date</u>
              </b>
            </p>
            <p>{dayjs(card.date.toDate()).format("MM/DD/YYYY")}</p>
            <p>
              <b>
                <u>Location</u>
              </b>
            </p>
            <p>{card.location}</p>
            <p>
              <b>
                <u>Description</u>
              </b>
            </p>
            <p>{card.description}</p>
            <Button type="danger" icon={<DeleteOutlined />} style={{ color: "red" }} onClick={() => deleteStick(card.id)}></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
