// src/components/ReportCardGlassColorCoded.tsx
import React from "react";
import { Card, Avatar, Table, Tag, Typography } from "antd";
import * as QRCode from "qrcode.react";

const { Title, Text } = Typography;

// Helper to compute days until date
const daysUntil = (dateStr: string) => {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

// Get color based on days until expiry
const getDateTagColor = (days: number) => {
  if (days < 0) return "red";
  if (days <= 30) return "orange";
  if (days <= 60) return "green";
  return "default";
};

export default function ReportCard() {
  const company = { name: "KRAFT NEXUS", logo: "/demo_logo.jpg" };
  const user = {
    name: "Vivek Vishwakarma",
    id: "EMP-00123",
    role: "Junior Developer",
    avatar: "/demo_small.png",
    phone: "+91 98765 43210",
    email: "vivek.vishwakarma@google.com",
    dob: "2004-05-12",
    address: "Mumbai, Maharashtra, India",
  };

  const licenceDetails = [
    {
      id: 1,
      type: "ATPL-007",
      validate: "25-Oct-2025",
      English: "25-Nov-2026",
      Medical: "14-Feb-2025",
      rtr: "05-May-2032",
      frtol: "21-Sep-2026",
    },
  ];

const recurrentChecks = [
  { id: 1, title: "PC", aw139: "2025-11-19", h145: "2025-11-19", n3: "2025-11-19" },
  { id: 2, title: "IR", aw139: "2025-05-21", h145: "2025-05-21", n3: "2025-05-21" },
  { id: 3, title: "Line Check", aw139: "2025-05-15", h145: "2025-05-15", n3: "2025-05-15" },
  { id: 4, title: "Hill Training", aw139: "2025-06-01", h145: "2025-06-01", n3: "2025-06-01" },
  { id: 5, title: "Hill Check", aw139: "2025-06-15", h145: "2025-06-15", n3: "2025-06-15" },
  { id: 6, title: "Night Currency", aw139: "2025-07-01", h145: "2025-07-01", n3: "2025-07-01" },
  { id: 7, title: "Recent Experience", aw139: "2025-01-15", h145: "2025-01-15", n3: "2025-01-15" },
  { id: 8, title: "Critical Emergencies", aw139: "2026-03-22", h145: "2026-03-22", n3: "2026-03-22" },
  { id: 9, title: "IF Training", aw139: "2025-07-14", h145: "2025-07-14", n3: "2025-07-14" },
  { id: 10, title: "TRE/TRI/CP Approval", aw139: "2028-07-21", h145: "2028-07-21", n3: "2028-07-21" },
  { id: 11, title: "TRE/TRI/CP Proficiency", aw139: "2026-10-15", h145: "2026-10-15", n3: "2026-10-15" },
  { id: 12, title: "Technical & Performance", aw139: "2025-04-20", h145: "2025-04-20", n3: "2025-04-20" },
  { id: 13, title: "Safety & Emergency Procedures", aw139: "2025-08-18", h145: "2025-08-18", n3: "2025-08-18" },
];


  const recurrentTraining = [
    { training: "CRM", date: "2025-04-05" },
    { training: "SGT", date: "2025-04-25" },
    { training: "AVSEC", date: "2026-06-19" },
    { training: "DGR", date: "2025-12-19" },
    { training: "SMS", date: "2025-07-18" },
    { training: "CPR", date: "2028-07-21" },
    { training: "Passenger Attendant", date: "2025-05-14" },
  ];

  const checksColumns = [
    { title: "Check", dataIndex: "title", key: "title" },
    { title: "AW139", dataIndex: "aw139", key: "aw139", render: (date: string) => <Tag color={getDateTagColor(daysUntil(date))}>{date}</Tag> },
    { title: "H145", dataIndex: "h145", key: "h145", render: (date: string) => <Tag color={getDateTagColor(daysUntil(date))}>{date}</Tag> },
    { title: "N3", dataIndex: "n3", key: "n3", render: (date: string) => <Tag color={getDateTagColor(daysUntil(date))}>{date}</Tag> },
  ];

  const licenceColumns = [
    { title: "License Type & Number", dataIndex: "type", key: "type" },
    { title: "Validity", dataIndex: "validate", key: "validate", render: (date: string) => <Tag color={getDateTagColor(daysUntil(date))}>{date}</Tag> },
    { title: "English Efficiency", dataIndex: "English", key: "English", render: (date: string) => <Tag color={getDateTagColor(daysUntil(date))}>{date}</Tag> },
    { title: "Class 1 Medical", dataIndex: "Medical", key: "Medical", render: (date: string) => <Tag color={getDateTagColor(daysUntil(date))}>{date}</Tag> },
    { title: "RTR", dataIndex: "rtr", key: "rtr", render: (date: string) => <Tag color={getDateTagColor(daysUntil(date))}>{date}</Tag> },
    { title: "FRTOL", dataIndex: "frtol", key: "frtol", render: (date: string) => <Tag color={getDateTagColor(daysUntil(date))}>{date}</Tag> },
  ];

  const trainingColumns = [
    { title: "Training", dataIndex: "training", key: "training" },
    { title: "Date", dataIndex: "date", key: "date", render: (date: string) => <Tag color={getDateTagColor(daysUntil(date))}>{date}</Tag> },
  ];

  const qrData = JSON.stringify({ licenceDetails });

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">

      {/* Company header */}
      <Card className="rounded-3xl shadow-2xl backdrop-blur-md bg-white/40 border border-white/30" bordered={false}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img src={company.logo} alt="company logo" style={{ height: 50, objectFit: "contain" }} />
          <div>
            <Title level={3} style={{ margin: 0 }}>{company.name}</Title>
            <Text type="secondary">PILOT'S TRAINING RECORDS</Text>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        {/* Left Panel: Avatar + Name + Personal Details */}


        <Card className="rounded-3xl shadow-2xl backdrop-blur-md bg-white/50 border border-white/30 p-6" bordered={false}>

          {/* Avatar + Name */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: "2px solid #1890ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}>
              <Avatar size={112} src={user.avatar} />
            </div>
            <Title level={4} style={{ margin: 0 }}>{user.name}</Title>
            <Text type="secondary">{user.role} • {user.id}</Text>
          </div>

          {/* Personal Details Table */}
          <Table
            dataSource={[
              { key: '1', field: 'Phone', value: user.phone },
              { key: '2', field: 'Email', value: user.email },
              { key: '3', field: 'DOB', value: user.dob },
              { key: '4', field: 'Address', value: user.address },
            ]}
            columns={[
              { title: 'Field', dataIndex: 'field', key: 'field', render: (text) => <Text strong>{text}</Text> },
              { title: 'Details', dataIndex: 'value', key: 'value' },
            ]}
            pagination={false}
            bordered
            size="small"
          />
        </Card>

        {/* Right Panel: Licence + QR */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-3xl shadow-2xl backdrop-blur-md bg-white/50 border border-white/30 p-6" bordered={false}>
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>


              {/* Licence Table */}
              <div style={{ flex: 2 }}>
                <Title level={5}>Licence Details</Title>
                <Table dataSource={licenceDetails} columns={licenceColumns} rowKey="id" pagination={false} bordered />
              </div>

              {/* QR Code */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 35 }}>
                <QRCode.QRCodeCanvas value={qrData} size={80} />
               
              </div>
            </div>
          </Card>

          {/* Recurrent Checks */}
          <Card title="Recurrent Checks" className="rounded-3xl shadow-2xl backdrop-blur-md bg-white/50 border border-white/30" bordered={false}>
            <Table dataSource={recurrentChecks} columns={checksColumns} rowKey="id" pagination={false} bordered />
          </Card>

          {/* Recurrent Training */}
          <Card title="Recurrent Training Records" className="rounded-3xl shadow-2xl backdrop-blur-md bg-white/50 border border-white/30" bordered={false}>
            <Table dataSource={recurrentTraining} columns={trainingColumns} rowKey="training" pagination={false} bordered />
          </Card>
        </div>
      </div>
    </div>
  );
}
