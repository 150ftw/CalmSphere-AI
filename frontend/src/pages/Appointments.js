import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppointments, bookAppointment, updateAppointmentStatus } from '../api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowLeft, Calendar, Clock, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function Appointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [formData, setFormData] = useState({
    counselor_name: '',
    appointment_date: '',
    appointment_type: 'campus',
    notes: ''
  });

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await getAppointments();
      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to load appointments', error);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await bookAppointment(formData);
      toast.success('Appointment booked successfully!');
      setShowBooking(false);
      setFormData({ counselor_name: '', appointment_date: '', appointment_type: 'campus', notes: '' });
      loadAppointments();
    } catch (error) {
      toast.error('Failed to book appointment');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      toast.success(`Appointment ${status}`);
      loadAppointments();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-background bg-noise">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          <Button
            data-testid="back-btn"
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            className="hover:bg-muted/50 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <Button
            data-testid="book-appointment-btn"
            onClick={() => setShowBooking(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6"
          >
            Book Appointment
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-16">
        <h1 className="font-fraunces text-4xl md:text-5xl font-normal mb-4">Counseling Appointments</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Schedule and manage your campus counseling appointments
        </p>

        {showBooking && (
          <div className="bg-card rounded-2xl shadow-float p-8 border border-border/40 mb-8">
            <h2 className="font-fraunces text-2xl font-medium mb-6">Book New Appointment</h2>
            <form data-testid="booking-form" onSubmit={handleBook} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Counselor Name (Optional)</label>
                <Input
                  data-testid="counselor-name-input"
                  value={formData.counselor_name}
                  onChange={(e) => setFormData({ ...formData, counselor_name: e.target.value })}
                  placeholder="Enter counselor name"
                  className="w-full bg-white/50 border-border/60 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-xl h-12 px-4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date & Time</label>
                <Input
                  data-testid="appointment-date-input"
                  type="datetime-local"
                  value={formData.appointment_date}
                  onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                  required
                  className="w-full bg-white/50 border-border/60 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-xl h-12 px-4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Appointment Type</label>
                <select
                  data-testid="appointment-type-select"
                  value={formData.appointment_type}
                  onChange={(e) => setFormData({ ...formData, appointment_type: e.target.value })}
                  className="w-full bg-white/50 border border-border/60 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-xl h-12 px-4"
                >
                  <option value="campus">Campus Counseling</option>
                  <option value="online">Online Session</option>
                  <option value="external">External Therapist</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                <Input
                  data-testid="notes-input"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any specific concerns or topics to discuss"
                  className="w-full bg-white/50 border-border/60 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-xl h-12 px-4"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => setShowBooking(false)}
                  variant="outline"
                  className="flex-1 rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  data-testid="submit-booking-btn"
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                >
                  Book Appointment
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Appointments List */}
        <div data-testid="appointments-list" className="space-y-4">
          {appointments.length === 0 ? (
            <div className="bg-card rounded-2xl p-12 border border-border/40 text-center">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" strokeWidth={1.5} />
              <p className="text-muted-foreground">No appointments scheduled yet</p>
            </div>
          ) : (
            appointments.map((appt) => (
              <div key={appt.id} className="bg-card rounded-2xl p-6 border border-border/40 shadow-soft">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="font-medium">
                        {new Date(appt.appointment_date).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-2 text-muted-foreground">
                      <Clock className="w-5 h-5" />
                      <span>
                        {new Date(appt.appointment_date).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {appt.counselor_name && (
                      <p className="text-sm text-muted-foreground mb-2">
                        Counselor: {appt.counselor_name}
                      </p>
                    )}
                    {appt.notes && (
                      <p className="text-sm text-muted-foreground">Notes: {appt.notes}</p>
                    )}
                    <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                      appt.status === 'scheduled' ? 'bg-primary/10 text-primary' :
                      appt.status === 'completed' ? 'bg-chart-4/10 text-chart-4' :
                      appt.status === 'cancelled' ? 'bg-muted text-muted-foreground' :
                      'bg-accent/10 text-accent'
                    }`}>
                      {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                    </span>
                  </div>
                  {appt.status === 'scheduled' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(appt.id, 'completed')}
                        className="bg-chart-4 text-white hover:bg-chart-4/90 rounded-full"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(appt.id, 'cancelled')}
                        className="rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}