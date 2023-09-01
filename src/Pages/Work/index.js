import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../Config/Config";
import { Card } from "antd"; // Import Card component from Ant Design (or other components you want to use)
import dayjs from "dayjs"; // Import dayjs for date formatting
import "./AllSticksPage.css"; // Import your CSS file for styling (if needed).

export default function Work() {
  const [sticks, setSticks] = useState([]);

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

  return (
    <div className="all-sticks-container">
      {sticks.map((card, i) => (
        <Card
          key={i}
          style={{ backgroundColor: card.bgcolor, borderRadius: "10px" }}
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
        </Card>
      ))}
    </div>
  );
}
