import { Avatar, Button, Card, QRCode, Select, Spin, Table, Tag, Typography } from "antd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
// import * as XLSX from "xlsx";

const { Title, Text } = Typography;
const { Option } = Select;

const antIcon = <LoadingOutlined style={{ fontSize: 16, color: "#fff" }} spin />;

export default function ReportCard() {
    const [pilots, setPilots] = useState<{ id: string; name: string }[]>([]);

    const [selectedPilot, setSelectedPilot] = useState<string | undefined>();
    const [crewReport, setCrewReport] = useState<any>(null);
    const [loadingPDF, setLoadingPDF] = useState(false);

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


    const fleets: string[] = crewReport
        ? Array.from(new Set(crewReport.recurrentChecks.trainings.map((t: any) => t.fleet)))
        : [];

    const trainingsMap: Record<string, any[]> = {};
    crewReport?.recurrentChecks.trainings.forEach((t: any) => {
        if (!trainingsMap[t.training]) trainingsMap[t.training] = [];
        trainingsMap[t.training].push(t);
    });

    const recurrentChecks = Object.keys(trainingsMap).map((trainingName, idx) => {
        const row: Record<string, any> = { id: idx + 1, training: trainingName };

        fleets.forEach(fleet => {
            const fleetTraining = trainingsMap[trainingName].find(t => t.fleet === fleet);
            row[fleet] = fleetTraining
                ? { doneOn: fleetTraining.doneOn, validTill: fleetTraining.validUntil, bg: fleetTraining.bgrColor, text: fleetTraining.textColor }
                : null;
        });

        return row;
    });

    const checksColumns = [
        { title: "Training", dataIndex: "training", key: "training" },
        ...fleets.flatMap(fleet => ([
            {
                title: fleet,
                children: [
                    {
                        title: "Done On",
                        dataIndex: [fleet, "doneOn"],
                        key: `${fleet}-doneOn`,
                        align: "center",
                        render: (val: any, record: any) => val ? <Tag style={{ backgroundColor: record[fleet]?.bg || "", color: record[fleet]?.text || "#000" }}>{val}</Tag> : "-"
                    },
                    {
                        title: "Valid Till",
                        dataIndex: [fleet, "validTill"],
                        key: `${fleet}-validTill`,
                        align: "center",
                        render: (val: any, record: any) => val ? <Tag style={{ backgroundColor: record[fleet]?.bg || "", color: record[fleet]?.text || "#000" }}>{val}</Tag> : "-"
                    }
                ]
            }
        ]))
    ];





    const trainingFleets: string[] = crewReport
        ? Array.from(new Set(crewReport.recurrentTraining.trainings.map((t: any) => t.fleet)))
        : [];

    const trainingMap: Record<string, any[]> = {};
    crewReport?.recurrentTraining.trainings.forEach((t: any) => {
        if (!trainingMap[t.training]) trainingMap[t.training] = [];
        trainingMap[t.training].push(t);
    });

    const recurrentTraining = Object.keys(trainingMap).map((trainingName, idx) => {
        const row: Record<string, any> = { id: idx + 1, training: trainingName };

        trainingFleets.forEach(fleet => {
            const fleetTraining = trainingMap[trainingName].find(t => t.fleet === fleet);
            row[fleet] = fleetTraining
                ? { doneOn: fleetTraining.doneOn, validTill: fleetTraining.validUntil, bg: fleetTraining.bgrColor, text: fleetTraining.textColor }
                : null;
        });

        return row;
    });

    const trainingColumns = [
        { title: "Training", dataIndex: "training", key: "training" },
        ...trainingFleets.flatMap(fleet => ([
            {
                title: fleet,
                children: [
                    {
                        title: "Done On",
                        dataIndex: [fleet, "doneOn"],
                        key: `${fleet}-doneOn`,
                        align: "center",
                        render: (val: any, record: any) => val ? <Tag style={{ backgroundColor: record[fleet]?.bg || "", color: record[fleet]?.text || "#000" }}>{val}</Tag> : "-"
                    },
                    {
                        title: "Valid Till",
                        dataIndex: [fleet, "validTill"],
                        key: `${fleet}-validTill`,
                        align: "center",
                        render: (val: any, record: any) => val ? <Tag style={{ backgroundColor: record[fleet]?.bg || "", color: record[fleet]?.text || "#000" }}>{val}</Tag> : "-"
                    }
                ]
            }
        ]))
    ];




    const handleDownloadPDF = async () => {
        const element = document.getElementById("pilot-records");
        if (!element) return;
        setLoadingPDF(true);



        const canvas = await html2canvas(element, {
            scale: 3,
            useCORS: true,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "pt", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;


        while (heightLeft > 0) {
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
            position -= pdfHeight;
            if (heightLeft > 0) pdf.addPage();
        }

        pdf.save("Pilot_Records.pdf");
        setLoadingPDF(false);
    };






    // const downloadExcel = () => {
    //     if (!crewReport) return;

    //     // Example: Export crewDetails + trainings
    //     const wb = XLSX.utils.book_new();

    //     // 1. Crew Details
    //     const crewSheet = XLSX.utils.json_to_sheet([crewReport.crewDetails]);
    //     XLSX.utils.book_append_sheet(wb, crewSheet, "Crew Details");

    //     // 2. Recurrent Checks
    //     const checksSheet = XLSX.utils.json_to_sheet(crewReport.recurrentChecks.trainings);
    //     XLSX.utils.book_append_sheet(wb, checksSheet, "Recurrent Checks");

    //     // 3. Recurrent Training
    //     const trainingSheet = XLSX.utils.json_to_sheet(crewReport.recurrentTraining.trainings);
    //     XLSX.utils.book_append_sheet(wb, trainingSheet, "Recurrent Training");

    //     XLSX.writeFile(wb, "pilot_training_records.xlsx");
    // };


    return (
        <div className=" min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <Card className="rounded-3xl shadow-2xl bg-white/40 border border-white/30 "
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
                        // filterOption={(input, option) =>
                        //     (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        // }
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
                            {loadingPDF ? <Spin indicator={antIcon} /> : "Download PDF"}
                        </Button>
                        {/* <Button type="default" onClick={downloadExcel}>
                            Download Excel
                        </Button> */}
                    </div>
                </div>
            </Card>


            {/* Layout */}
            <div id="pilot-records">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-2 items-start">

                    {/*  Personal Details + License + Medical Reports */}
                    <Card className="rounded-3xl shadow-2xl bg-white/50 border border-white/30  " >
                        <div className="flex flex-col gap-6">

                            {/* 1. Personal Details */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                                {/* Avatar */}
                                <Avatar
                                    size={112}
                                    src={user.profileImagePath || "/demo_small.png"}
                                    style={{ border: "3px solid #1890ff" }}
                                />

                                {/* Name */}
                                <Title level={4} style={{ margin: 0 }}>
                                    {user.crewName}
                                </Title>

                                {/* Role & QR code  */}
                                <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "center", position: "relative" }}>
                                    <Text type="secondary">{user.role}</Text>

                                    {user.license && (
                                        <div style={{ position: "absolute", right: 0 }}>
                                            <QRCode
                                                value={JSON.stringify({
                                                    license: user.license,
                                                    licenseValidity: user.licenseValidity,
                                                    medicalExpiry: user.medicalExpiry,
                                                    rtrValidity: user.rtrValidity,
                                                    frtolValidity: user.frtolValidity,
                                                })}
                                                size={80}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Title level={5} style={{ margin: "8px 0" }} >Personal Details</Title>
                                <Table
                                    dataSource={[
                                        // { key: "1", Item: "Abbreviation", value: user.abbreviation },
                                        // { key: "2", Item: "Phone", value: user.contactNo },
                                        // { key: "3", Item: "Email", value: user.emailId },
                                        { key: "1", Item: "DOB", value: user.dateOfBirth },
                                        { key: "2", Item: "Employee ID", value: user.employeCode },
                                        { key: "3", Item: "Date of Joining", value: user.dateOfJoining },
                                        { key: "4", Item: "PMR File No", value: user.pmrFileNo },
                                        { key: "5", Item: "eGCA ID", value: user.egcaId },
                                        { key: "6", Item: "Type Endorsed", value: user.typeEndorsed },
                                        { key: "7", Item: "Current Type Flying", value: user.currentTypeFlying },
                                        // { key: "11", Item: "Address", value: user.homeBase },
                                    ]}
                                    columns={[
                                        { title: "Item", dataIndex: "Item", key: "Item", render: text => <Text strong>{text}</Text> },
                                        { title: "Details", dataIndex: "value", key: "value" },
                                    ]}
                                    pagination={false}
                                    bordered
                                    size="small"
                                />
                            </div>


                            {/*  License Details */}




                            <div>
                                <Title level={5} style={{ margin: "8px 0" }}>License Details</Title>
                                <Table
                                    dataSource={[
                                        {
                                            key: "1",
                                            type: "License",
                                            number: user.license,
                                            validity: user.licenseValidity,
                                        },
                                        {
                                            key: "2",
                                            type: "RTR",
                                            number: user.rtrNumber,
                                            validity: user.rtrValidity,
                                        },
                                        {
                                            key: "3",
                                            type: "FRTOL",
                                            number: user.frtolNumber,
                                            validity: user.frtolValidity,
                                        },
                                    ]}
                                    columns={[
                                        {
                                            title: "License Type",
                                            dataIndex: "type",
                                            key: "type",
                                            render: (text) => <Text strong>{text}</Text>,
                                        },
                                        {
                                            title: "Number",
                                            dataIndex: "number",
                                            key: "number",
                                            align: "center",
                                        },
                                        {
                                            title: "Validity",
                                            dataIndex: "validity",
                                            key: "validity",
                                            align: "center",
                                        },
                                    ]}
                                    pagination={false}
                                    bordered
                                    size="small"
                                />




                            </div>





                            {/*  Medical Reports */}
                            <div>
                                <Title level={5}>Medical </Title>

                                <Table
                                    dataSource={[
                                        { key: "1", Item: "Medical Done on", value: "01-09-25" },
                                    ]}
                                    columns={[
                                        { title: "Item", dataIndex: "Item", key: "Item", render: text => <Text strong>{text}</Text> },
                                        { title: "Valid Till", dataIndex: "value", key: "value" },
                                    ]}
                                    pagination={false}
                                    bordered
                                    size="small"
                                    style={{ marginBottom: 16 }}
                                />

                                {/* English Proficiency */}
                                <Title level={5}>English Proficiency </Title>
                                <Table
                                    dataSource={[
                                        { key: "1", level: user.epLevel, value: user.epDate },
                                    ]}
                                    columns={[
                                        { title: "Level", dataIndex: "level", key: "level", render: text => <Text strong>{text}</Text> },
                                        { title: "Valid Till", dataIndex: "value", key: "value" },
                                    ]}
                                    pagination={false}
                                    bordered
                                    size="small"
                                />
                            </div>




                        </div>
                    </Card>




                    { /* Checks + Training */}
                    <div className="lg:col-span-2  flex flex-col gap-2 ">


                        {/* Checks */}
                        <Card className="rounded-3xl shadow-2xl bg-white/50 border border-white/30 ">
                            <div >
                                <Title level={5}>Recurrent Checks </Title>
                            </div>

                            <Table
                                dataSource={recurrentChecks}
                                columns={checksColumns}
                                rowKey="id"
                                pagination={false}
                                bordered
                                size="small"
                            />
                        </Card>


                        {/* Training */}

                        <Card className="rounded-3xl shadow-2xl bg-white/50 border border-white/30 ">
                            <div >
                                <Title level={5}>Recurrent Training </Title>
                            </div>

                            <Table
                                dataSource={recurrentTraining}
                                columns={trainingColumns}
                                rowKey="id"
                                pagination={false}
                                bordered
                                size="small"
                            />
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    );
}
