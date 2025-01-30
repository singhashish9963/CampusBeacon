import React from "react";
import { Mail, Phone } from "lucide-react";

function ContactCard({ name, phone, email }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        maxWidth: "300px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2 style={{ marginBottom: "8px" }}>{name}</h2>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}
      >
        <Phone size={16} style={{ marginRight: "8px" }} />
        <span>{phone}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Mail size={16} style={{ marginRight: "8px" }} />
        <span>{email}</span>
      </div>
    </div>
  );
}

export default ContactCard;
