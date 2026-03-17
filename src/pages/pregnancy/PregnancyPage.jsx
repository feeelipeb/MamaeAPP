import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import PregnancyEmptyState from '../../components/pregnancy/PregnancyEmptyState';
import ActivePregnancyDashboard from './ActivePregnancyDashboard';
import PastPregnancySummaryDashboard from './PastPregnancySummaryDashboard';
import './PregnancyPage.css';

export default function PregnancyPage() {
  const { user } = useAuth();
  const [activePregnancy, setActivePregnancy] = useState(null);
  const [completedPregnancies, setCompletedPregnancies] = useState([]);
  const [selectedPastPregnancy, setSelectedPastPregnancy] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPregnancies = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Fetch user's pregnancies
      const { data, error } = await supabase
        .from('pregnancies')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Find active
        const active = data.find(p => p.status === 'active');
        // Find completed
        const completed = data.filter(p => p.status === 'completed');

        setActivePregnancy(active || null);
        setCompletedPregnancies(completed || []);
      } else {
        setActivePregnancy(null);
        setCompletedPregnancies([]);
      }
    } catch (err) {
      console.error("Error fetching pregnancies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPregnancies();
  }, [user]);

  if (loading) {
    return (
      <div className="pregnancy-loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="pregnancy-module-container animate-fade-in">
      {selectedPastPregnancy ? (
        <PastPregnancySummaryDashboard 
          pregnancy={selectedPastPregnancy} 
          onBack={() => setSelectedPastPregnancy(null)} 
        />
      ) : activePregnancy ? (
        <ActivePregnancyDashboard 
          pregnancy={activePregnancy} 
          onPregnancyUpdate={fetchPregnancies} 
        />
      ) : (
        <PregnancyEmptyState 
          completedPregnancies={completedPregnancies} 
          onPregnancyCreated={fetchPregnancies} 
          onSelectPastPregnancy={(p) => setSelectedPastPregnancy(p)}
        />
      )}
    </div>
  );
}
