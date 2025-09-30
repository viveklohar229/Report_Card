import React, { useEffect, useState } from "react";
import { Card, Avatar, Table, Tag, Typography, Select, Spin, Button } from "antd";
import * as QRCode from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";

const { Title, Text } = Typography;
const { Option } = Select;

export default function ReportCard() {
    const [pilots, setPilots] = useState<{ id: string; name: string }[]>([]);

    const [selectedPilot, setSelectedPilot] = useState<string | undefined>();
    const [crewReport, setCrewReport] = useState<any>(null);

    // Fetch pilots
    useEffect(() => {
        const fetchPilots = async () => {
            try {
                const res = await fetch("https://dev-trainx-api.kraftnexus.in/api/Master/pilots", {
                    headers: { accept: "*/*", TenantId: "DEMO" },
                });
                const data = await res.json();
                setPilots(data);
            } catch (err) {
                console.error("Error fetching pilots:", err);
            } finally {
                //    
            }
        };
        fetchPilots();
    }, []);

    // Fetch crew report
    useEffect(() => {
        if (!selectedPilot) return;
        const fetchCrewReport = async () => {
            try {
                const res = await fetch(
                    `https://dev-trainx-api.kraftnexus.in/api/Reports/crew-report?crewId=${selectedPilot}`,
                    { headers: { accept: "*/*", TenantId: "DEMO" } }
                );
                const data = await res.json();
                setCrewReport(data);
            } catch (err) {
                console.error("Error fetching crew report:", err);
                setCrewReport(null);
            }
        };
        fetchCrewReport();
    }, [selectedPilot]);

    const user = crewReport?.crewDetails || {};

    //  License details
    const licenceDetails = crewReport
        ? [
            {
                id: 1,
                type: user.license,
                licenseValidity: {
                    date: user.licenseValidity,
                    bg: user.licenseBgColor,
                    text: user.licenseTextColor,
                },
                medical: {
                    date: user.medicalExpiry,
                    bg: user.medicalBgColor,
                    text: user.medicalTextColor,
                },
                rtr: {
                    date: user.rtrValidity,
                    bg: user.rtrBgColor,
                    text: user.rtrTextColor,
                },
                frtol: {
                    date: user.frtolValidity,
                    bg: user.frtolBgColor,
                    text: user.frtolTextColor,
                },
            },
        ]
        : [];

    const licenceColumns = [
        { title: "License Type & Number", dataIndex: "type", key: "type" },
        {
            title: "License Validity",
            dataIndex: "licenseValidity",
            key: "licenseValidity",
            render: (val: any) =>
                val?.date ? (
                    <div style={{ minHeight: 24, display: "flex", alignItems: "center" }}>
                        <Tag style={{ backgroundColor: val.bg || "#d9d9d9", color: val.text || "#000", padding: "4px 8px", lineHeight: "1.5", display: "inline-block", }}>
                            {val.date}
                        </Tag>
                    </div>
                ) : (
                    "-"
                ),
        },
        {
            title: "Class 1 Medical",
            dataIndex: "medical",
            key: "medical",
            render: (val: any) =>
                val?.date ? (
                    <div style={{ minHeight: 24, display: "flex", alignItems: "center" }}>
                        <Tag style={{ backgroundColor: val.bg || "#d9d9d9", color: val.text || "#000", padding: "4px 8px", lineHeight: "1.5", display: "inline-block", }}>
                            {val.date}
                        </Tag>
                    </div>
                ) : (
                    "-"
                ),
        },
        {
            title: "RTR",
            dataIndex: "rtr",
            key: "rtr",
            render: (val: any) =>
                val?.date ? (
                    <div style={{ minHeight: 24, display: "flex", alignItems: "center" }}>
                        <Tag style={{ backgroundColor: val.bg || "#d9d9d9", color: val.text || "#000", padding: "4px 8px", lineHeight: "1.5", display: "inline-block", }}>
                            {val.date}
                        </Tag>
                    </div>
                ) : (
                    "-"
                ),
        },
        {
            title: "FRTOL",
            dataIndex: "frtol",
            key: "frtol",
            render: (val: any) =>
                val?.date ? (
                    <div style={{ minHeight: 24, display: "flex", alignItems: "center" }}>

                        <Tag style={{ backgroundColor: val.bg || "#d9d9d9", color: val.text || "#000", padding: "4px 8px", lineHeight: "1.5", display: "inline-block", }}>
                            {val.date}
                        </Tag>
                    </div>
                ) : (
                    "-"
                ),
        },
    ];

    //  Recurrent Checks
    const fleets = ["AW139", "H145", "N3"];
    const recurrentChecks = crewReport
        ? crewReport.recurrentChecks.trainings.map((t: any, idx: number) => ({
            id: idx + 1,
            training: t.training,
            ...fleets.reduce((acc, fleet) => {
                if (t.fleet === fleet) {
                    acc[fleet.toLowerCase()] = {
                        date: t.validUntil,
                        bg: t.bgrColor,
                        text: t.textColor,
                    };
                }
                return acc;
            }, {} as any),
        }))
        : [];

    const checksColumns = [
        { title: "Check", dataIndex: "training", key: "training" },
        ...fleets.map((fleet) => ({
            title: fleet,
            dataIndex: fleet.toLowerCase(),
            key: fleet.toLowerCase(),
            render: (val: any) =>
                val?.date ? (
                    <div style={{ minHeight: 24, display: "flex", alignItems: "center" }}>

                        <Tag style={{ backgroundColor: val.bg || "#d9d9d9", color: val.text || "#000", padding: "4px 8px", lineHeight: "1.5", display: "inline-block", }}>
                            {val.date}
                        </Tag>
                    </div>
                ) : (
                    "-"
                ),
        })),
    ];

    //  Recurrent Training
    const recurrentTraining = crewReport
        ? crewReport.recurrentTraining.trainings.map((t: any) => ({
            id: t.id,
            training: t.training,
            date: t.validUntil,
            bg: t.bgrColor,
            text: t.textColor,
        }))
        : [];

    const trainingColumns = [
        { title: "Training", dataIndex: "training", key: "training" },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (_: any, record: any) =>
                record.date ? (
                    <div style={{ minHeight: 24, display: "flex", alignItems: "center" }}>

                        <Tag style={{ backgroundColor: record.bg || "#d9d9d9", color: record.text || "#000", padding: "4px 8px", lineHeight: "1.5", display: "inline-block", }}>
                            {record.date}
                        </Tag>
                    </div>
                ) : (
                    "-"
                ),
        },
    ];

    const handleDownloadPDF = async () => {
        const element = document.getElementById("pilot-records");
        if (!element) return;

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "pt", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = pdfHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();

        while (heightLeft > 0) {
            position = heightLeft - pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();
        }

        pdf.save("Pilot_Records.pdf");
    };




    const downloadExcel = () => {
        if (!crewReport) return;

        // Example: Export crewDetails + trainings
        const wb = XLSX.utils.book_new();

        // 1. Crew Details
        const crewSheet = XLSX.utils.json_to_sheet([crewReport.crewDetails]);
        XLSX.utils.book_append_sheet(wb, crewSheet, "Crew Details");

        // 2. Recurrent Checks
        const checksSheet = XLSX.utils.json_to_sheet(crewReport.recurrentChecks.trainings);
        XLSX.utils.book_append_sheet(wb, checksSheet, "Recurrent Checks");

        // 3. Recurrent Training
        const trainingSheet = XLSX.utils.json_to_sheet(crewReport.recurrentTraining.trainings);
        XLSX.utils.book_append_sheet(wb, trainingSheet, "Recurrent Training");

        XLSX.writeFile(wb, "pilot_training_records.xlsx");
    };


    return (
        <div className="p-8 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <Card className="rounded-3xl shadow-2xl bg-white/40 border border-white/30"
            //   bordered={false}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>

                        <Select
                            style={{ width: 300 }}
                            placeholder="Select Pilot"
                            value={selectedPilot}
                            onChange={(value) => setSelectedPilot(value)}
                            showSearch
                            optionFilterProp="label"
                            filterOption={(input, option) =>
                                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {pilots.map((pilot) => (
                                <Option key={pilot.id} value={pilot.id} label={pilot.name}>
                                    {pilot.name}
                                </Option>
                            ))}
                        </Select>


                        {/* <div>
                            <Title level={3} style={{ margin: 0 }}>
                                KRAFT NEXUS
                            </Title>
                            <Text type="secondary">PILOT'S TRAINING RECORDS</Text>
                        </div> */}
                    </div>

                    {/*  Right side buttons */}
                    <div style={{ display: "flex", gap: 10 }}>
                        <Button type="primary" onClick={handleDownloadPDF}>
                            Download PDF
                        </Button>
                        {/* <Button type="default" onClick={downloadExcel}>
                            Download Excel
                        </Button> */}
                    </div>
                </div>
            </Card>


            {/* Layout */}
            <div id="pilot-records">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                    {/* Personal Details */}
                    <Card
                        className="rounded-3xl shadow-2xl bg-white/50 border border-white/30 p-6"
                    //   bordered={false}
                    >
                        <div className="flex flex-col items-center gap-2 mb-4">
                            <Avatar
                                size={112}
                                src={user.photoUrl || "/demo_small.png"}
                                style={{
                                    border: "3px solid #1890ff",
                                }}
                            />
                            <Title level={4} style={{ margin: 0 }}>
                                {user.crewName}
                            </Title>
                            <Text type="secondary">
                                {user.role} • {user.employeCode}
                            </Text>
                        </div>

                        <Table
                            dataSource={[
                                { key: "1", field: "Phone", value: user.contactNo },
                                { key: "2", field: "Email", value: user.emailId },
                                { key: "3", field: "DOB", value: user.dateOfBirth },
                                { key: "4", field: "License", value: user.license },
                            ]}
                            columns={[
                                {
                                    title: "Field",
                                    dataIndex: "field",
                                    key: "field",
                                    render: (text) => <Text strong>{text}</Text>,
                                },
                                { title: "Details", dataIndex: "value", key: "value" },
                            ]}
                            pagination={false}
                            bordered
                            size="small"
                        />
                    </Card>


                    {/* License + Checks + Training */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* License */}
                        <Card className="rounded-3xl shadow-2xl bg-white/50 border border-white/30 p-6"
                        //    bordered={false}
                        >
                            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                                <div style={{ flex: 2 }}>
                                    <Title level={5}>Licence Details</Title>
                                    <Table dataSource={licenceDetails} columns={licenceColumns} rowKey="id" pagination={false}
                                     bordered 
                                    />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 65 }}>
                                    <QRCode.QRCodeCanvas value={JSON.stringify(licenceDetails)} size={80} />
                                </div>
                            </div>
                        </Card>

                        {/* Checks */}
                        <Card className="rounded-3xl shadow-2xl bg-white/50 border border-white/30 p-6">
                            <div style={{ marginBottom: 16 }}>
                                <Title level={5}>Recurrent Checks Records</Title>
                            </div>

                            <Table
                                dataSource={recurrentChecks}
                                columns={checksColumns}
                                rowKey="id"
                                pagination={false}
                                 bordered 
                            />
                        </Card>


                        {/* Training */}

                        <Card className="rounded-3xl shadow-2xl bg-white/50 border border-white/30 p-6">
                            <div style={{ marginBottom: 16 }}>
                                <Title level={5}>Recurrent Training Records</Title>
                            </div>

                            <Table
                                dataSource={recurrentTraining}
                                columns={trainingColumns}
                                rowKey="id"
                                pagination={false}
                                 bordered 
                            />
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    );
}
