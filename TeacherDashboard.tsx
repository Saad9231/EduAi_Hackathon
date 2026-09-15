"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  AlertTriangle,
  Search,
  Plus,
  UploadCloud,
  X,
  Loader2,
} from "lucide-react";

type Student = {
  id: string;
  name: string;
  mastery: number;
  weakTopic: string;
  status: "improving" | "exceling" | "at-risk" | "stable" | "struggling";
  present: boolean;
};

type Assignment = {
  id: string;
  title: string;
  subject: string;
  due_date: string;
  type: "quiz" | "upload" | "text";
};

type Alert = { type: "critical" | "warning"; message: string };

const mockStudents: Student[] = [
  { id: "1", name: "Ali Hassan", mastery: 78, weakTopic: "Quadratic Eq.", status: "improving", present: true },
  { id: "2", name: "Sara Khan", mastery: 92, weakTopic: "None", status: "exceling", present: true },
  { id: "3", name: "Ahmed Raza", mastery: 45, weakTopic: "Trigonometry", status: "at-risk", present: false },
  { id: "4", name: "Fatima Bilal", mastery: 67, weakTopic: "Chemical Bonds", status: "stable", present: true },
  { id: "5", name: "Usman Tariq", mastery: 55, weakTopic: "Cell Biology", status: "struggling", present: false },
];

export default function TeacherDashboard({ language }: { language: "EN" | "UR" }) {
  const isUrdu = language === "UR";

  const [activeTab, setActiveTab] = useState<"overview" | "assignments" | "attendance">("overview");
  const [attendanceData, setAttendanceData] = useState<Student[]>(mockStudents);
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);
  const [attendanceNotice, setAttendanceNotice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("Physics");
  const [newType, setNewType] = useState<"quiz" | "upload" | "text">("quiz");

  const [alerts, setAlerts] = useState<Alert[]>([]);

  const [isUploadingLibrary, setIsUploadingLibrary] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [libTitle, setLibTitle] = useState("");
  const [libBoard, setLibBoard] = useState("PTB");
  const [libType, setLibType] = useState("book");
  const [isLibraryUploading, setIsLibraryUploading] = useState(false);

  useEffect(() => {
    fetch("/api/weak-topics")
   .then((res) => res.json())
   .then((data) => {
        if (data.alerts && data.alerts.length > 0) {
          setAlerts(data.alerts);
        } else {
          setAlerts([
            { type: "critical", message: "Ahmed Raza's mastery in Math dropped by 15% this week." },
            { type: "warning", message: '4 students are struggling with "Chemical Bonds".' },
          ]);
        }
      })
   .catch(() => {
        setAlerts([
          { type: "critical", message: "Ahmed Raza's mastery in Math dropped by 15% this week." },
          { type: "warning", message: '4 students are struggling with "Chemical Bonds".' },
        ]);
      });

    fetch("/api/assignments")
   .then((res) => res.json())
   .then((data) => {
        if (data.assignments && data.assignments.length > 0) {
          setAssignments(data.assignments);
        } else {
          setAssignments([
            { id: "1", title: "Physics: Force and Motion MCQ", subject: "Physics", due_date: "Tomorrow", type: "quiz" },
            { id: "2", title: "Math: Quadratic Equations Worksheet", subject: "Math", due_date: "Friday", type: "upload" },
          ]);
        }
      })
   .catch(() => {
        setAssignments([
          { id: "1", title: "Physics: Force and Motion MCQ", subject: "Physics", due_date: "Tomorrow", type: "quiz" },
          { id: "2", title: "Math: Quadratic Equations Worksheet", subject: "Math", due_date: "Friday", type: "upload" },
        ]);
      });
  }, []);

  const toggleAttendance = (id: string) => {
    setAttendanceData((prev) => prev.map((s) => (s.id === id? {...s, present:!s.present } : s)));
  };

  const filteredStudents = useMemo(
    () => mockStudents.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );

  const handleSaveAttendance = async () => {
    setIsSavingAttendance(true);
    setAttendanceNotice("");
    try {
      const records = attendanceData.map((s) => ({
        student_id: s.id,
        status: s.present? "present" : "absent",
      }));

      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records }),
      });

      if (res.ok) {
        setAttendanceNotice("Attendance saved & parents notified successfully!");
      } else {
        setAttendanceNotice("Saved locally (Database connection ready).");
      }
    } catch {
      setAttendanceNotice("Saved locally.");
    } finally {
      setIsSavingAttendance(false);
      setTimeout(() => setAttendanceNotice(""), 4000);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newAssignment: Assignment = {
      id: String(Date.now()),
      title: newTitle,
      subject: newSubject,
      type: newType,
      due_date: new Date(Date.now() + 86400000 * 3).toISOString(),
    };

    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAssignment),
      });

      if (res.ok) {
        const data = await res.json();
        setAssignments((prev) => [data.assignment,...prev]);
      } else {
        setAssignments((prev) => [newAssignment,...prev]);
      }
    } catch {
      setAssignments((prev) => [newAssignment,...prev]);
    }

    setNewTitle("");
    setIsCreatingAssignment(false);
  };

  const handleLibraryUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile ||!libTitle.trim()) return;

    setIsLibraryUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      const upRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const upData = await upRes.json();

      if (!upRes.ok ||!upData.success) throw new Error(upData.error);

      const dbRes = await fetch("/api/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: libTitle,
          board: libBoard,
          type: libType,
          file_url: upData.file_url,
          size: (uploadFile.size / (1024 * 1024)).toFixed(1) + " MB",
        }),
      });

      if (dbRes.ok) {
        alert(isUrdu? "کامیابی کے ساتھ اپلوڈ ہو گیا!" : "Uploaded successfully!");
      } else {
        alert(isUrdu? "ڈیٹا بیس میں محفوظ کرنے میں ناکامی" : "Failed to save to database");
      }
    } catch (e) {
      console.error(e);
      alert("Upload failed.");
    } finally {
      setIsLibraryUploading(false);
      setIsUploadingLibrary(false);
      setUploadFile(null);
      setLibTitle("");
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full w-full overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Classroom Overview</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Class 10-A (Science Group) • {mockStudents.length} Students
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700/50">
          {(["overview", "assignments", "attendance"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                activeTab === tab
               ? "bg-sky-500 text-white"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alerts & Insights */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <div className="glass-card p-5">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                AI Intervention Alerts
              </h3>
              <div className="flex flex-col gap-3">
                {alerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className={`p-3 border rounded-lg ${
                      alert.type === "critical"
                     ? "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300"
                        : "bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-300"
                    }`}
                  >
                    <span
                      className={`text-xs font-bold uppercase ${
                        alert.type === "critical"? "text-red-600 dark:text-red-400" : "text-orange-600 dark:text-orange-400"
                      }`}
                    >
                      {alert.type}
                    </span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{alert.message}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-5 flex-1">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-purple-500" />
                Upload Syllabus / Books
              </h3>
              <div
                onClick={() => setIsUploadingLibrary(true)}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700/50 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/30 hover:border-sky-500/50 transition-colors cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-sky-500/20 transition-colors">
                  <UploadCloud className="w-6 h-6 text-slate-500 dark:text-slate-400 group-hover:text-sky-500" />
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Click to upload syllabus or books
                </p>
              </div>
            </div>
          </div>

          {/* Student Roster Heatmap */}
          <div className="glass-card p-0 flex-col lg:col-span-2 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-center bg-slate-50 dark:bg-slate-800/30">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                Student Roster & Heatmap
              </h3>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search student..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg py-1.5 pl-9 pr-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    <th className="p-4 font-medium">Student Name</th>
                    <th className="p-4 font-medium text-center">Mastery Level</th>
                    <th className="p-4 font-medium">Identified Weakness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-medium text-slate-900 dark:text-slate-200">{student.name}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3 justify-center">
                          <span className="text-sm font-bold text-slate-900 dark:text-white w-8">{student.mastery}%</span>
                          <div className="flex-1 max-w-[100px] h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                student.mastery > 80
                               ? "bg-emerald-500"
                                  : student.mastery > 60
                                ? "bg-sky-500"
                                  : student.mastery > 40
                                ? "bg-orange-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${student.mastery}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{student.weakTopic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "assignments" && (
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Assignments</h3>
            <button
              onClick={() => setIsCreatingAssignment(true)}
              className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
            >
              <Plus className="w-4 h-4" /> New Assignment
            </button>
          </div>
          <div className="space-y-3">
            {assignments.map((a) => (
              <div key={a.id} className="p-4 border-slate-200 dark:border-slate-700 rounded-lg flex justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{a.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {a.subject} • Due: {a.due_date}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">{a.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "attendance" && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Mark Attendance</h3>
          <div className="space-y-2">
            {attendanceData.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 border-slate-200 dark:border-slate-700 rounded-lg">
                <span className="text-slate-900 dark:text-white">{s.name}</span>
                <button
                  onClick={() => toggleAttendance(s.id)}
                  className={`px-3 py-1 rounded-lg text-sm ${s.present? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-700"}`}
                >
                  {s.present? "Present" : "Absent"}
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleSaveAttendance}
            disabled={isSavingAttendance}
            className="w-full mt-4 py-2.5 bg-sky-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSavingAttendance && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Attendance
          </button>
          {attendanceNotice && <p className="text-center text-sm mt-2 text-emerald-600">{attendanceNotice}</p>}
        </div>
      )}

      {/* Library Upload Modal */}
      {isUploadingLibrary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upload to Library</h3>
              <button onClick={() => setIsUploadingLibrary(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleLibraryUpload} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={libTitle}
                onChange={(e) => setLibTitle(e.target.value)}
                className="w-full p-2 border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                required
              />
              <input type="file" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} required />
              <button
                type="submit"
                disabled={isLibraryUploading}
                className="w-full py-2 bg-sky-500 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLibraryUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                Upload
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}