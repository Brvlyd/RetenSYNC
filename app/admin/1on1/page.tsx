
"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { oneOnOneData } from "@/lib/dummy-data";
import EditMeetingModal from "@/components/admin/EditMeetingModal";
import {
  Calendar,
  Clock,
  User,
  Plus,
  Video,
  MessageSquare,
  Target,
  TrendingUp,
  Users,
  X,
  Settings,
  Filter,
  Search,
  Eye,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Edit,
  Trash2,
  BarChart3,
  Shield,
} from "lucide-react";

type ScheduleMeetingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    type: string;
    employee: string;
    manager: string;
    department: string;
    project: string;
    notes: string;
    date: string;
    time: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    type: string;
    employee: string;
    manager: string;
    department: string;
    project: string;
    notes: string;
    date: string;
    time: string;
  }>>;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

function ScheduleMeetingModal(props: ScheduleMeetingModalProps) {
  const { isOpen, onClose, formData, setFormData, isSubmitting, handleSubmit } = props;
  const modalRef = useRef<HTMLDivElement>(null);
  const [modalTop, setModalTop] = useState(24);

  useLayoutEffect(() => {
    function updateModalTop() {
      if (modalRef.current) {
        const modalHeight = (modalRef.current as HTMLDivElement).offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;
        const top = Math.max(scrollY + (windowHeight - modalHeight) / 2, scrollY + 24);
        setModalTop(top);
      }
    }
    if (isOpen) {
      updateModalTop();
      window.addEventListener("scroll", updateModalTop);
      window.addEventListener("resize", updateModalTop);
    }
    return () => {
      window.removeEventListener("scroll", updateModalTop);
      window.removeEventListener("resize", updateModalTop);
    };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 p-4" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 w-full max-w-xs sm:max-w-md lg:max-w-3xl shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto relative"
        style={{
          position: "absolute",
          top: modalTop,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* ...existing code for form fields... */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">Meeting Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white text-sm sm:text-base"
              >
                <option>Manager Check-in</option>
                <option>Performance Review</option>
                <option>Career Development</option>
                <option>Goal Setting</option>
                <option>Feedback Session</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white text-sm sm:text-base"
              >
                <option value="">Select department...</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">Employee</label>
              <select
                value={formData.employee}
                onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
                className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white text-sm sm:text-base"
              >
                <option value="">Select employee...</option>
                <option value="Putri Aulia Simanjuntak">Putri Aulia Simanjuntak</option>
                <option value="Bravely Dirgayuska">Bravely Dirgayuska</option>
                <option value="Dzikri Razzan Athallah">Dzikri Razzan Athallah</option>
                <option value="Annisa Zulfiani">Annisa Zulfiani</option>
                <option value="Tasya Salsabila">Tasya Salsabila</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">Manager</label>
              <select
                value={formData.manager}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white text-sm sm:text-base"
              >
                <option value="">Select manager...</option>
                <option value="Sarah Johnson">Sarah Johnson</option>
                <option value="Michael Chen">Michael Chen</option>
                <option value="David Wilson">David Wilson</option>
                <option value="Lisa Rodriguez">Lisa Rodriguez</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white text-sm sm:text-base"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">Project/Context</label>
            <input
              type="text"
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
              placeholder="e.g., Q4 Product Launch"
              className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">Meeting Agenda & Notes</label>
            <textarea
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Share agenda, talking points, and preparation notes..."
              className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 resize-none text-gray-900 dark:text-white text-sm sm:text-base"
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 sm:px-6 py-2 sm:py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl lg:rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 font-semibold text-sm sm:text-base w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl lg:rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center font-semibold text-sm sm:text-base w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:scale-110 transition-transform" />
              )}
              {isSubmitting ? "Scheduling..." : "Schedule Meeting"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminOneOnOne() {
  // Add margin to top so header doesn't cut content
  // You can adjust this value if your header height changes
  const pageTopMargin = 'mt-24 sm:mt-28 lg:mt-32';
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);
  const [selectedView, setSelectedView] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [isHydrated, setIsHydrated] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    type: "Manager Check-in",
    employee: "",
    manager: "",
    department: "",
    project: "",
    notes: "",
    date: "",
    time: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extended dummy data for admin view
  const adminMeetingData = [
    ...oneOnOneData,
    {
      id: 3,
      with: "Putri Aulia Simanjuntak",
      employee: "Putri Aulia Simanjuntak",
      manager: "Sarah Johnson",
      department: "Marketing",
      date: "2024-01-22",
      time: "9:00 AM",
      agenda: ["Performance review", "Career goals", "Skill development"],
      notes: "Discuss marketing campaign performance and growth opportunities",
      status: "ongoing",
      priority: "high",
    },
    {
      id: 4,
      with: "Annisa Zulfiani",
      employee: "Annisa Zulfiani",
      manager: "Michael Chen",
      department: "Engineering",
      date: "2024-01-19",
      time: "3:30 PM",
      agenda: ["Code review", "Technical challenges", "Team collaboration"],
      notes: "Review recent project contributions and technical growth",
      status: "completed",
      priority: "medium",
    },
    {
      id: 5,
      with: "Tasya Salsabila",
      employee: "Tasya Salsabila",
      manager: "David Wilson",
      department: "Sales",
      date: "2024-01-16",
      time: "11:00 AM",
      agenda: ["Sales performance", "Client feedback", "Goal setting"],
      notes: "Outstanding Q4 performance, discuss territory expansion",
      status: "completed",
      priority: "high",
    },
  ];

  const filteredMeetings = adminMeetingData.filter((meeting) => {
    const department = (meeting as any).department || "";
    const manager = (meeting as any).manager || "";
    const matchesSearch =
      meeting.with.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesView = selectedView === "all" || meeting.status === selectedView;
    const matchesDepartment = selectedDepartment === "all" || department === selectedDepartment;
    return matchesSearch && matchesView && matchesDepartment;
  });

  useEffect(() => {
    setAnimateCards(true);
    setIsHydrated(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.employee || !formData.manager || !formData.date || !formData.time) {
      alert("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      alert("Meeting scheduled successfully!");
      setFormData({
        type: "Manager Check-in",
        employee: "",
        manager: "",
        department: "",
        project: "",
        notes: "",
        date: "",
        time: "",
      });
      setShowScheduleForm(false);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleEditMeeting = (meeting: any) => {
    setEditingMeeting(meeting);
    setShowEditModal(true);
  };

  const handleSaveMeeting = (updatedMeeting: any) => {
    // In a real app, this would update the meeting in the database
    console.log("Saving meeting:", updatedMeeting);
    alert("Meeting updated successfully!");
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingMeeting(null);
  };

  return (
    <div className={`space-y-6 lg:space-y-8 ${pageTopMargin}`}>
      {/* Loading spinner */}
      {!isHydrated && (
        <div className="space-y-6 lg:space-y-8">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-rose-600/20 rounded-2xl lg:rounded-3xl blur-xl"></div>
            <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 dark:border-gray-700/20 shadow-2xl">
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Enhanced Admin Header with Controls */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-rose-600/20 rounded-2xl lg:rounded-3xl blur-xl"></div>
        <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 dark:border-gray-700/20 shadow-2xl">
          <div className="flex flex-col space-y-4 lg:space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl lg:rounded-3xl shadow-lg">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 dark:from-gray-100 dark:via-purple-100 dark:to-pink-100 bg-clip-text text-transparent">
                    Admin: 1-on-1 Meetings
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg mt-1">Manage and oversee all organizational 1-on-1 meetings</p>
                </div>
              </div>
              <button
                onClick={() => setShowScheduleForm(true)}
                className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl lg:rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl hover:scale-105 w-full lg:w-auto justify-center lg:justify-start"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-semibold text-sm sm:text-base">Schedule Meeting</span>
              </button>
            </div>

            {/* Admin Controls */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              {/* Search */}
              <div className="relative flex-1 lg:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search meetings, employees, or departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-gray-900 dark:text-white"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 lg:gap-4">
                <select
                  value={selectedView}
                  onChange={(e) => setSelectedView(e.target.value)}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-gray-900 dark:text-white text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                </select>

                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-gray-900 dark:text-white text-sm"
                >
                  <option value="all">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-200 dark:border-gray-600">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{filteredMeetings.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Meetings</div>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-200 dark:border-gray-600">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{filteredMeetings.filter((m) => m.status === "upcoming").length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Upcoming</div>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-200 dark:border-gray-600">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{filteredMeetings.filter((m) => m.status === "ongoing").length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Ongoing</div>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-200 dark:border-gray-600">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{filteredMeetings.filter((m) => m.status === "completed").length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-200 dark:border-gray-600">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{filteredMeetings.filter((m) => 'priority' in m && m.priority === "high").length}</div>
                <div className="text-sm text-gray-600 dark:text-amber-400">High Priority</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Admin Schedule Form Modal */}
        {showScheduleForm && (
          <ScheduleMeetingModal
            isOpen={showScheduleForm}
            onClose={() => setShowScheduleForm(false)}
            formData={formData}
            setFormData={setFormData}
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit}
          />
        )}

        {/* Edit Meeting Modal */}
        <EditMeetingModal
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          meeting={editingMeeting}
          onSave={handleSaveMeeting}
        />
      </div>

      {/* Enhanced Admin Meetings List */}
      <div className="space-y-4 sm:space-y-6">
        {filteredMeetings.slice(0, -1).map((meeting, index) => {
          const getStatusStyles = (status: string) => {
            switch (status) {
              case 'ongoing':
                return {
                  border: 'border-orange-300 dark:border-orange-700 shadow-orange-200/50 dark:shadow-orange-900/30',
                  background: 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
                  pulse: '',
                  statusBadge: 'bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40 text-orange-800 dark:text-orange-200 border border-orange-300 dark:border-orange-600'
                };
              case 'upcoming':
                return {
                  border: 'border-blue-200 dark:border-blue-700 shadow-blue-100/50 dark:shadow-blue-900/20',
                  background: 'bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-900/10 dark:to-cyan-900/10',
                  pulse: '',
                  statusBadge: 'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700'
                };
              case 'completed':
                return {
                  border: 'border-emerald-200 dark:border-emerald-700 shadow-emerald-100/50 dark:shadow-emerald-900/20',
                  background: 'bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/10 dark:to-teal-900/10',
                  pulse: '',
                  statusBadge: 'bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700'
                };
              default:
                return {
                  border: 'border-gray-200 dark:border-gray-700',
                  background: 'bg-white dark:bg-gray-800',
                  pulse: '',
                  statusBadge: 'bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-700'
                };
            }
          };

          const statusStyles = getStatusStyles(meeting.status);

          return (
            <div
              key={meeting.id}
              className={`group ${statusStyles.background} rounded-2xl lg:rounded-3xl border ${statusStyles.border} shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden ${statusStyles.pulse} ${
                animateCards ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  {/* Left: Main Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${statusStyles.statusBadge}`}>{meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}</span>
                      {'priority' in meeting && meeting.priority === 'high' && (
                        <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-200 to-orange-200 dark:from-amber-900/40 dark:to-orange-900/40 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700">High Priority</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-purple-500" />
                      <span className="font-semibold text-gray-900 dark:text-white text-lg sm:text-xl">{meeting.with}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                        <Users className="h-4 w-4" />{(meeting as any).department}
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                        <UserCheck className="h-4 w-4" />{(meeting as any).manager}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />{meeting.date}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4" />{meeting.time}
                      </div>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-xs text-gray-700 dark:text-gray-300">Agenda:</span>
                      {Array.isArray((meeting as any).agenda) && (meeting as any).agenda.length > 0 ? (
                        <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 ml-2 mt-1">
                          {(meeting as any).agenda.map((item: string, idx: number) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="block text-xs text-gray-400 dark:text-gray-500 ml-2 mt-1">No agenda provided.</span>
                      )}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold text-xs text-gray-700 dark:text-gray-300">Notes:</span>
                      {meeting.notes ? (
                        <span className="block text-xs text-gray-600 dark:text-gray-400 mt-1">{meeting.notes}</span>
                      ) : (
                        <span className="block text-xs text-gray-400 dark:text-gray-500 mt-1">No notes provided.</span>
                      )}
                    </div>
                  </div>
                  {/* Right: Actions */}
                  <div className="flex flex-col gap-2 items-end min-w-[90px]">
                    <button
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold shadow hover:from-purple-600 hover:to-pink-600 transition-all"
                      onClick={() => handleEditMeeting(meeting)}
                      type="button"
                    >
                      <Edit className="h-4 w-4" /> Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Admin Analytics Dashboard */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-4 sm:p-6 lg:p-8">
        {/* ...existing code for analytics dashboard... */}
      </div>
    </div>
  );
}