'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Clock,
  User,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  Users,
  Building,
  Target,
  FileText,
  Hash,
} from 'lucide-react';

interface Meeting {
  id: number;
  with: string;
  employee: string;
  manager: string;
  department: string;
  date: string;
  time: string;
  agenda: string[];
  notes: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'in-progress';
  priority: 'high' | 'medium' | 'low';
}

interface EditMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: Meeting | null;
  onSave: (updatedMeeting: Meeting) => void;
}

export default function EditMeetingModal({
  isOpen,
  onClose,
  meeting,
  onSave,
}: EditMeetingModalProps) {
  const [formData, setFormData] = useState({
    employee: '',
    manager: '',
    department: '',
    date: '',
    time: '',
    agenda: '',
    notes: '',
    status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed' | 'in-progress',
    priority: 'medium' as 'high' | 'medium' | 'low',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [modalTop, setModalTop] = useState<number | null>(null);

  // Populate form when meeting prop changes
  useEffect(() => {
    if (meeting) {
      setFormData({
        employee: meeting.employee || meeting.with,
        manager: meeting.manager,
        department: meeting.department,
        date: meeting.date,
        time: meeting.time,
        agenda: meeting.agenda?.join(', ') || '',
        notes: meeting.notes,
        status: meeting.status,
        priority: meeting.priority,
      });
      setHasChanges(false);
    }
  }, [meeting]);

  // Track changes
  useEffect(() => {
    if (meeting) {
      const originalData = {
        employee: meeting.employee || meeting.with,
        manager: meeting.manager,
        department: meeting.department,
        date: meeting.date,
        time: meeting.time,
        agenda: meeting.agenda?.join(', ') || '',
        notes: meeting.notes,
        status: meeting.status,
        priority: meeting.priority,
      };

      const hasChanged = Object.keys(formData).some(
        key =>
          formData[key as keyof typeof formData] !==
          originalData[key as keyof typeof originalData]
      );
      setHasChanges(hasChanged);
    }
  }, [formData, meeting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.employee ||
      !formData.manager ||
      !formData.date ||
      !formData.time
    ) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      if (meeting) {
        const updatedMeeting: Meeting = {
          ...meeting,
          employee: formData.employee,
          with: formData.employee,
          manager: formData.manager,
          department: formData.department,
          date: formData.date,
          time: formData.time,
          agenda: formData.agenda
            .split(',')
            .map(item => item.trim())
            .filter(Boolean),
          notes: formData.notes,
          status: formData.status,
          priority: formData.priority,
        };

        onSave(updatedMeeting);
        onClose();
      }
      setIsSubmitting(false);
    }, 1000);
  };

  const handleClose = () => {
    if (hasChanges) {
      if (
        window.confirm(
          'You have unsaved changes. Are you sure you want to close?'
        )
      ) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (modalRef.current) {
          const modalHeight = modalRef.current.offsetHeight;
          const scrollY = window.scrollY;
          const top = scrollY + (window.innerHeight - modalHeight) / 2;
          setModalTop(top > 24 ? top : 24); // 24px padding
        }
      }, 0);
    } else {
      setModalTop(null);
    }
  }, [isOpen]);

  if (!isOpen || !meeting) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 p-4"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: 'auto',
      }}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 w-full max-w-xs sm:max-w-md lg:max-w-4xl shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto relative"
        style={{
          position: 'absolute',
          top: modalTop !== null ? modalTop : window.scrollY + 24,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mr-2 sm:mr-3">
              <User className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <span className="hidden sm:inline">Edit 1-on-1 Meeting</span>
            <span className="sm:hidden">Edit Meeting</span>
          </h3>
          <div className="flex items-center space-x-2">
            {hasChanges && (
              <div className="flex items-center space-x-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full text-xs">
                <AlertCircle className="h-3 w-3" />
                <span>Unsaved</span>
              </div>
            )}
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Meeting Status Banner */}
        <div
          className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl border-l-4 ${
            meeting.status === 'ongoing'
              ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500 text-orange-800 dark:text-orange-200'
              : meeting.status === 'upcoming'
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-800 dark:text-blue-200'
                : 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                meeting.status === 'ongoing'
                  ? 'bg-orange-500'
                  : meeting.status === 'upcoming'
                    ? 'bg-blue-500'
                    : 'bg-green-500'
              }`}
            ></div>
            <span className="font-semibold text-sm">
              Meeting ID: #{meeting.id} • Status:{' '}
              {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Employee & Manager */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center">
                <User className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                Employee *
              </label>
              <select
                value={formData.employee}
                onChange={e =>
                  setFormData({ ...formData, employee: e.target.value })
                }
                className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white text-sm sm:text-base"
                required
              >
                <option value="">Select employee...</option>
                <option value="Putri Aulia Simanjuntak">
                  Putri Aulia Simanjuntak
                </option>
                <option value="Bravely Dirgayuska">Bravely Dirgayuska</option>
                <option value="Dzikri Razzan Athallah">
                  Dzikri Razzan Athallah
                </option>
                <option value="Annisa Zulfiani">Annisa Zulfiani</option>
                <option value="Tasya Salsabila">Tasya Salsabila</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center">
                <Users className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                Manager *
              </label>
              <select
                value={formData.manager}
                onChange={e =>
                  setFormData({ ...formData, manager: e.target.value })
                }
                className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white text-sm sm:text-base"
                required
              >
                <option value="">Select manager...</option>
                <option value="Sarah Johnson">Sarah Johnson</option>
                <option value="Michael Chen">Michael Chen</option>
                <option value="David Wilson">David Wilson</option>
                <option value="Lisa Rodriguez">Lisa Rodriguez</option>
              </select>
            </div>
          </div>

          {/* Department & Priority */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center">
                <Building className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                Department
              </label>
              <select
                value={formData.department}
                onChange={e =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white text-sm sm:text-base"
              >
                <option value="">Select department...</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={e =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as 'high' | 'medium' | 'low',
                  })
                }
                className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white text-sm sm:text-base"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={e =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                Time *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={e =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white text-sm sm:text-base"
                required
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
              Meeting Status
            </label>
            <select
              value={formData.status}
              onChange={e =>
                setFormData({
                  ...formData,
                  status: e.target.value as
                    | 'upcoming'
                    | 'ongoing'
                    | 'completed'
                    | 'in-progress',
                })
              }
              className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white text-sm sm:text-base"
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Agenda */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center">
              <Target className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
              Meeting Agenda
            </label>
            <input
              type="text"
              value={formData.agenda}
              onChange={e =>
                setFormData({ ...formData, agenda: e.target.value })
              }
              placeholder="e.g., Performance review, Career goals, Skill development"
              className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white text-sm sm:text-base"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Separate multiple agenda items with commas
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center">
              <FileText className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
              Meeting Notes
            </label>
            <textarea
              rows={4}
              value={formData.notes}
              onChange={e =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Share meeting notes, key discussion points, and action items..."
              className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 resize-none text-gray-900 dark:text-white text-sm sm:text-base"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 sm:px-6 py-2 sm:py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl lg:rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 font-semibold text-sm sm:text-base w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !hasChanges}
              className="group px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl lg:rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center font-semibold text-sm sm:text-base w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Save className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:scale-110 transition-transform" />
              )}
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
