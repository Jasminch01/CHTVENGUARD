"use client";
import { useParams } from "next/navigation";
import React from "react";

const NewsDetailsContentpage = () => {
  const { newsId } = useParams();
  return (
    <div>
      <p>{newsId}</p>
    </div>
  );
};

export default NewsDetailsContentpage;
