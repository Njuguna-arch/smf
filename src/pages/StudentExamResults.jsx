import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import api from "../services/api";
import { fetchStudentResults } from "../services/examService";
import { getCurrentUser } from "../services/authService";

const gradeColor = (grade) => {
  switch (grade) {
    case "EE1": return "#4caf50";
    case "EE2": return "#66bb6a";
    case "ME1": return "#2196f3";
    case "ME2": return "#64b5f6";
    case "AE1": return "#ff9800";
    case "AE2": return "#ffb74d";
    case "BE1": return "#f44336";
    case "BE2": return "#e57373";
    default: return "#757575";
  }
};

const getPointsFromGrade = (grade) => {
  switch (grade) {
    case "EE1": return 8;
    case "EE2": return 7;
    case "ME1": return 6;
    case "ME2": return 5;
    case "AE1": return 4;
    case "AE2": return 3;
    case "BE1": return 2;
    case "BE2": return 1;
    default: return 0;
  }
};

const generateClientPDF = (exam) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const studentName = exam.studentId?.name || "Student";
  const admNo = exam.admissionNumber || "N/A";
  const examPeriod = `${exam.examType || ""} ${exam.term || ""} ${exam.year || ""}`.trim();
  const overallGrade = exam.overallGrade || "N/A";
  const position = exam.position || "N/A";
  const comment = exam.overallComment || "Good progress. Keep working hard.";
  const subjects = exam.subjectResults || [];

  // Colors
  const primaryColor = [46, 125, 50]; // #2e7d32
  const darkColor = [38, 50, 56]; // #263238
  const lightBg = [244, 246, 248];

  // Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(14, 12, 182, 22, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("EDUSPHERE ACADEMY", 105, 21, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("OFFICIAL STUDENT EXAM REPORT CARD", 105, 28, { align: "center" });

  // Student Info Card
  doc.setDrawColor(207, 216, 220);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(14, 38, 182, 28, 2, 2, "FD");

  doc.setTextColor(...darkColor);
  doc.setFontSize(9.5);

  // Left column
  doc.setFont("helvetica", "bold");
  doc.text("Student Name:", 18, 45);
  doc.setFont("helvetica", "normal");
  doc.text(studentName, 52, 45);

  doc.setFont("helvetica", "bold");
  doc.text("Admission No:", 18, 53);
  doc.setFont("helvetica", "normal");
  doc.text(admNo, 52, 53);

  doc.setFont("helvetica", "bold");
  doc.text("Exam Period:", 18, 61);
  doc.setFont("helvetica", "normal");
  doc.text(examPeriod, 52, 61);

  // Right column
  doc.setFont("helvetica", "bold");
  doc.text("Overall Grade:", 115, 45);
  doc.setTextColor(...primaryColor);
  doc.text(overallGrade, 148, 45);

  doc.setTextColor(...darkColor);
  doc.setFont("helvetica", "bold");
  doc.text("Position / Rank:", 115, 53);
  doc.setFont("helvetica", "normal");
  doc.text(position, 148, 53);

  doc.setFont("helvetica", "bold");
  doc.text("Date Issued:", 115, 61);
  doc.setFont("helvetica", "normal");
  doc.text(new Date().toLocaleDateString("en-GB"), 148, 61);

  // Table Header
  const tableY = 72;
  doc.setFillColor(...primaryColor);
  doc.rect(14, tableY, 182, 8, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("SUBJECT", 20, tableY + 5.5);
  doc.text("MARKS (%)", 90, tableY + 5.5, { align: "center" });
  doc.text("GRADE", 130, tableY + 5.5, { align: "center" });
  doc.text("RUBRICS / POINTS", 170, tableY + 5.5, { align: "center" });

  let curY = tableY + 8;
  let totalMarks = 0;
  let count = 0;

  subjects.forEach((subj, idx) => {
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : lightBg[0], isEven ? 255 : lightBg[1], isEven ? 255 : lightBg[2]);
    doc.rect(14, curY, 182, 7.5, "F");

    doc.setDrawColor(220, 224, 226);
    doc.line(14, curY + 7.5, 196, curY + 7.5);

    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(subj.subjectName || "Subject", 20, curY + 5);

    const m = Number(subj.marks);
    if (!isNaN(m)) {
      totalMarks += m;
      count++;
      doc.text(String(m), 90, curY + 5, { align: "center" });
    } else {
      doc.text("-", 90, curY + 5, { align: "center" });
    }

    doc.setFont("helvetica", "bold");
    doc.text(subj.grade || "-", 130, curY + 5, { align: "center" });

    doc.setFont("helvetica", "normal");
    const points = subj.points ?? getPointsFromGrade(subj.grade);
    doc.text(String(points), 170, curY + 5, { align: "center" });

    curY += 7.5;
  });

  // Summary Row
  doc.setFillColor(232, 245, 233);
  doc.rect(14, curY, 182, 8, "F");
  doc.setDrawColor(200, 230, 201);
  doc.line(14, curY + 8, 196, curY + 8);

  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("TOTAL / AVERAGE:", 20, curY + 5.5);
  const avg = count > 0 ? (totalMarks / count).toFixed(1) : "N/A";
  doc.text(`${totalMarks}  (Avg: ${avg}%)`, 90, curY + 5.5, { align: "center" });
  doc.text(`Overall: ${overallGrade}`, 170, curY + 5.5, { align: "center" });

  curY += 13;

  // Teacher's remark box
  doc.setFillColor(241, 248, 233);
  doc.setDrawColor(200, 230, 201);
  doc.roundedRect(14, curY, 182, 16, 2, 2, "FD");

  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("Class Teacher's Remark:", 18, curY + 5);

  doc.setTextColor(...darkColor);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  doc.text(`"${comment}"`, 18, curY + 11);

  curY += 25;

  // Signatures
  const sigY = Math.max(curY, 240);
  doc.setDrawColor(160, 160, 160);
  doc.line(20, sigY, 75, sigY);
  doc.line(135, sigY, 190, sigY);

  doc.setTextColor(...darkColor);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Class Teacher's Signature", 47.5, sigY + 4, { align: "center" });
  doc.text("Principal / Headteacher", 162.5, sigY + 4, { align: "center" });

  // Footer Note
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(7.5);
  doc.text(
    "This is an official document generated by the EduSphere School Management System.",
    105,
    285,
    { align: "center" }
  );

  const cleanFileName = `${studentName.replace(/[^a-zA-Z0-9]/g, "_")}_${examPeriod.replace(/[^a-zA-Z0-9]/g, "_")}_Results.pdf`;
  doc.save(cleanFileName);
};

const StudentExamResults = () => {
  // All Hooks declared at top level
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedExamType, setSelectedExamType] = useState("Mid-Term");
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  const [selectedYear, setSelectedYear] = useState(2026);

  const [appliedExamType, setAppliedExamType] = useState("Mid-Term");
  const [appliedTerm, setAppliedTerm] = useState("Term 1");
  const [appliedYear, setAppliedYear] = useState(2026);

  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState("");

  const user = getCurrentUser();

  useEffect(() => {
    const loadResults = async () => {
      setLoading(true);
      setError("");

      if (!user?.admissionNumber) {
        setError("Student ID is missing. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchStudentResults(user.admissionNumber);
        const normalizedData = Array.isArray(data) ? data : data?.exams || [];
        setResults(normalizedData);

        // If results exist, automatically select the most recent exam session
        if (normalizedData.length > 0) {
          const first = normalizedData[0];
          if (first.examType) {
            setSelectedExamType(first.examType);
            setAppliedExamType(first.examType);
          }
          if (first.term) {
            setSelectedTerm(first.term);
            setAppliedTerm(first.term);
          }
          if (first.year) {
            setSelectedYear(Number(first.year));
            setAppliedYear(Number(first.year));
          }
        }
      } catch (err) {
        console.error("Error fetching student results:", err.message);
        setError("Failed to load exam results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [user?.admissionNumber]);

  const handleSearch = () => {
    setAppliedExamType(selectedExamType);
    setAppliedTerm(selectedTerm);
    setAppliedYear(Number(selectedYear));
  };

  const filteredResults = results.filter((exam) => {
    const matchExamType =
      !appliedExamType ||
      (exam.examType && exam.examType.toLowerCase() === appliedExamType.toLowerCase());
    const matchTerm =
      !appliedTerm ||
      (exam.term && exam.term.toLowerCase() === appliedTerm.toLowerCase());
    const matchYear =
      !appliedYear ||
      Number(exam.year) === Number(appliedYear);
    return matchExamType && matchTerm && matchYear;
  });

  const exam = filteredResults.length > 0 ? filteredResults[0] : null;

  const printReportFallback = (examData, payloadData) => {
    const p = payloadData || {
      name: examData.studentId?.name || "Student",
      admission: examData.admissionNumber,
      examType: `${examData.examType} ${examData.term} ${examData.year}`,
      grade: examData.overallGrade,
      position: examData.position || "N/A",
      subjects: (examData.subjectResults || []).map((s) => ({
        name: s.subjectName,
        marks: s.marks,
        grade: s.grade,
        points: getPointsFromGrade(s.grade),
      })),
      comment: examData.overallComment || "N/A",
    };

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to download or print the exam report.");
      return;
    }

    const rowsHtml = (p.subjects || [])
      .map(
        (s, i) => `
        <tr style="background-color: ${i % 2 === 0 ? "#ffffff" : "#f9fbf9"};">
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${s.name}</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd; text-align: center;">${s.marks}</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: #2e7d32;">${s.grade}</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd; text-align: center;">${s.points}</td>
        </tr>`
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${p.name} - Exam Results</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 25px; color: #333; margin: 0; }
            .header { text-align: center; border-bottom: 3px solid #2e7d32; padding-bottom: 12px; margin-bottom: 20px; }
            .header h1 { color: #2e7d32; margin: 0 0 5px 0; font-size: 24px; }
            .header p { margin: 0; color: #666; font-size: 14px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; background: #f4f6f8; padding: 15px; border-radius: 6px; }
            .info-item { font-size: 14px; }
            .info-item strong { color: #2e7d32; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; }
            th { background-color: #2e7d32; color: #fff; padding: 10px; text-align: left; }
            th.center { text-align: center; }
            .comment-box { background: #f1f8e9; border-left: 4px solid #2e7d32; padding: 12px 16px; border-radius: 4px; margin-bottom: 30px; font-style: italic; }
            .signatures { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; }
            .sig-line { width: 200px; border-top: 1px solid #999; text-align: center; padding-top: 5px; font-size: 12px; color: #555; }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>EDUSPHERE ACADEMY</h1>
            <p>Official Student Examination Performance Report</p>
          </div>
          <div class="info-grid">
            <div class="info-item"><strong>Student:</strong> ${p.name}</div>
            <div class="info-item"><strong>Overall Grade:</strong> ${p.grade}</div>
            <div class="info-item"><strong>Admission No:</strong> ${p.admission}</div>
            <div class="info-item"><strong>Rank/Position:</strong> ${p.position}</div>
            <div class="info-item"><strong>Exam Period:</strong> ${p.examType}</div>
            <div class="info-item"><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th class="center">Marks</th>
                <th class="center">Grade</th>
                <th class="center">Rubrics / Points</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
          <div class="comment-box">
            <strong>Class Teacher's Remark:</strong> ${p.comment}
          </div>
          <div class="signatures">
            <div class="sig-line">Class Teacher's Signature</div>
            <div class="sig-line">Principal / Headteacher</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadPDF = async () => {
    if (downloadingPdf || !exam) return;
    setDownloadingPdf(true);
    setDownloadSuccess("");

    const payload = {
      name: exam.studentId?.name || "Student",
      admission: exam.admissionNumber,
      examType: `${exam.examType} ${exam.term} ${exam.year}`,
      grade: exam.overallGrade,
      position: exam.position || "N/A",
      subjects: (exam.subjectResults || []).map((subj) => ({
        name: subj.subjectName,
        marks: subj.marks,
        grade: subj.grade,
        points: getPointsFromGrade(subj.grade),
      })),
      comment: exam.overallComment || "Good progress. Keep working hard.",
    };

    let downloaded = false;

    // 1. Try server-side PDF generation endpoint (/api/exams/student-report)
    try {
      const response = await api.post("/exams/student-report", payload, {
        responseType: "blob",
        timeout: 5000,
      });

      if (response.data && response.data.size > 0 && response.data.type?.includes("pdf")) {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const link = document.createElement("a");
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = `${exam.studentId?.name || "Student"}_${exam.examType}_${exam.term}_${exam.year}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        downloaded = true;
      }
    } catch (err1) {
      console.warn("POST /exams/student-report attempt failed, trying fallback...", err1.message);
    }

    // 2. Try direct route /api/exams/:admissionNumber/:examType/:term/:year/pdf
    if (!downloaded) {
      try {
        const response = await api.get(
          `/exams/${encodeURIComponent(exam.admissionNumber)}/${encodeURIComponent(exam.examType)}/${encodeURIComponent(exam.term)}/${encodeURIComponent(exam.year)}/pdf`,
          { responseType: "blob", timeout: 5000 }
        );
        if (response.data && response.data.size > 0 && response.data.type?.includes("pdf")) {
          const blob = new Blob([response.data], { type: "application/pdf" });
          const link = document.createElement("a");
          const url = window.URL.createObjectURL(blob);
          link.href = url;
          link.download = `${exam.studentId?.name || "Student"}_${exam.examType}_${exam.term}_${exam.year}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          downloaded = true;
        }
      } catch (err2) {
        console.warn("GET direct exam PDF route failed, using client PDF generator...", err2.message);
      }
    }

    // 3. Client-side PDF generation with jsPDF (guaranteed instant offline & online PDF download)
    if (!downloaded) {
      try {
        generateClientPDF(exam);
        downloaded = true;
      } catch (err3) {
        console.error("Client-side jsPDF failed, falling back to print dialog:", err3);
      }
    }

    // 4. Last-resort fallback: browser printable report
    if (!downloaded) {
      printReportFallback(exam, payload);
    }

    setDownloadingPdf(false);
    if (downloaded) {
      setDownloadSuccess("PDF downloaded successfully!");
      setTimeout(() => setDownloadSuccess(""), 4000);
    }
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f9f9f9", borderRadius: "8px", maxWidth: "900px", margin: "0 auto" }}>
      {/* Filters Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          background: "#fff",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <div>
          <label style={{ marginRight: "8px", fontWeight: "bold", fontSize: "14px" }}>Exam Type:</label>
          <select
            value={selectedExamType}
            onChange={(e) => setSelectedExamType(e.target.value)}
            style={{ padding: "6px 12px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="Opener">Opener</option>
            <option value="Mid-Term">Mid-Term</option>
            <option value="End-Term">End-Term</option>
          </select>
        </div>

        <div>
          <label style={{ marginRight: "8px", fontWeight: "bold", fontSize: "14px" }}>Term:</label>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            style={{ padding: "6px 12px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
        </div>

        <div>
          <label style={{ marginRight: "8px", fontWeight: "bold", fontSize: "14px" }}>Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{ padding: "6px 12px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
            <option value={2028}>2028</option>
          </select>
        </div>

        <button
          onClick={handleSearch}
          style={{
            padding: "7px 18px",
            backgroundColor: "#2e7d32",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Search
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#555" }}>
          <p style={{ fontSize: "16px" }}>Loading exam results...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div
          style={{
            backgroundColor: "#ffebee",
            color: "#c62828",
            padding: "16px",
            borderRadius: "6px",
            textAlign: "center",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      {/* No results for current filter */}
      {!loading && !error && !exam && (
        <div
          style={{
            textAlign: "center",
            padding: "2.5rem 1rem",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <p style={{ fontSize: "17px", fontWeight: "bold", color: "#424242", marginBottom: "8px" }}>
            No exam results found for {appliedExamType} — {appliedTerm} {appliedYear}.
          </p>
          <p style={{ fontSize: "14px", color: "#666" }}>
            Please select another exam type, term, or year from the dropdowns above.
          </p>

          {/* Quick-select chips if other results are available */}
          {results.length > 0 && (
            <div style={{ marginTop: "1.5rem" }}>
              <p style={{ fontSize: "13px", fontWeight: "bold", color: "#2e7d32", marginBottom: "8px" }}>
                Available Results for Your Profile:
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
                {results.map((r, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedExamType(r.examType);
                      setSelectedTerm(r.term);
                      setSelectedYear(Number(r.year));
                      setAppliedExamType(r.examType);
                      setAppliedTerm(r.term);
                      setAppliedYear(Number(r.year));
                    }}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "16px",
                      border: "1px solid #2e7d32",
                      backgroundColor: "#e8f5e9",
                      color: "#2e7d32",
                      fontSize: "13px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    {r.examType} • {r.term} • {r.year}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Exam Result Display */}
      {!loading && !error && exam && (
        <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          {/* Student Info */}
          <h2 style={{ textAlign: "center", color: "#2e7d32", margin: "0 0 8px 0" }}>
            {exam.studentId?.name || "Student"}
          </h2>
          <p style={{ textAlign: "center", margin: "4px 0", color: "#555" }}>
            Admission Number: <strong>{exam.admissionNumber}</strong>
          </p>
          <p style={{ textAlign: "center", margin: "4px 0", fontWeight: "bold" }}>
            Overall Grade: <span style={{ color: gradeColor(exam.overallGrade) }}>{exam.overallGrade || "N/A"}</span>
            {exam.position && exam.position !== "N/A" && (
              <span style={{ marginLeft: "15px", color: "#555" }}>Rank: {exam.position}</span>
            )}
          </p>
          <p style={{ textAlign: "center", margin: "4px 0", color: "#777", fontSize: "14px" }}>
            {exam.examType} — {exam.term} {exam.year}
          </p>

          {/* Results Table */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1.5rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#2e7d32", color: "#fff" }}>
                <th style={{ ...thStyle, color: "#fff", textAlign: "left" }}>Subject</th>
                <th style={thStyle}>Marks (%)</th>
                <th style={thStyle}>Grade</th>
                <th style={thStyle}>Rubrics / Points</th>
              </tr>
            </thead>
            <tbody>
              {(exam.subjectResults || []).map((subj, idx) => {
                const points = getPointsFromGrade(subj.grade);
                return (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#fff" : "#f9fbf9" }}>
                    <td style={{ ...tdStyle, textAlign: "left", fontWeight: "500" }}>{subj.subjectName}</td>
                    <td style={tdStyle}>{subj.marks}</td>
                    <td style={{ ...tdStyle, color: gradeColor(subj.grade), fontWeight: "bold" }}>
                      {subj.grade}
                    </td>
                    <td style={pointsStyle}>{points}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Teacher Comment */}
          <div
            style={{
              marginTop: "1.5rem",
              padding: "12px 16px",
              backgroundColor: "#f1f8e9",
              borderLeft: "4px solid #2e7d32",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            <strong>Class Teacher's Comment:</strong> {exam.overallComment || "Good progress. Keep working hard."}
          </div>

          {/* Download Action Section */}
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
              onClick={handleDownloadPDF}
              disabled={downloadingPdf}
              style={{
                padding: "12px 28px",
                backgroundColor: downloadingPdf ? "#81c784" : "#2e7d32",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: downloadingPdf ? "not-allowed" : "pointer",
                fontWeight: "bold",
                fontSize: "15px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
              </svg>
              {downloadingPdf ? "Generating PDF..." : "Download PDF Softcopy"}
            </button>

            {downloadSuccess && (
              <p style={{ color: "#2e7d32", marginTop: "8px", fontWeight: "bold", fontSize: "14px" }}>
                ✓ {downloadSuccess}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const thStyle = { border: "1px solid #ddd", padding: "10px 12px", textAlign: "center", fontSize: "14px" };
const tdStyle = { border: "1px solid #ddd", padding: "10px 12px", textAlign: "center", fontSize: "14px" };
const pointsStyle = {
  ...tdStyle,
  fontWeight: "bold",
  color: "#2e7d32",
  padding: "10px 16px",
};

export default StudentExamResults;
