import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ModulePage from './pages/ModulePage';
import RoutinePage from './pages/RoutinePage';
import ProfilePage from './pages/ProfilePage';
import BabyPage from './pages/BabyPage';
import BabyDetailPage from './pages/BabyDetailPage';
import PregnancyPage from './pages/pregnancy/PregnancyPage';
import CalendarPage from './pages/CalendarPage';
import MenuPage from './pages/MenuPage';
import MenuStagePage from './pages/MenuStagePage';
import ActivitiesPage from './pages/ActivitiesPage';
import ActivityStagePage from './pages/ActivityStagePage';
import AchievementsPage from './pages/AchievementsPage';
import InstallManager from './components/InstallManager';

const moduleRoutes = [
  'memories', 'stories',
];

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <InstallManager>
                  <DashboardLayout />
                </InstallManager>
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="baby" element={<BabyPage />} />
            <Route path="baby/:id" element={<BabyDetailPage />} />
            <Route path="pregnancy/*" element={<PregnancyPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="menu/:slug" element={<MenuStagePage />} />
            {/* Routine Module */}
            <Route path="routine" element={<RoutinePage />} />

            {/* Achievements Module with optional child selection */}
            <Route path="conquistas" element={<AchievementsPage />} />
            <Route path="conquistas/:childId" element={<AchievementsPage />} />

            {/* Activities Module (Atividades) */}
            <Route path="atividades" element={<ActivitiesPage />} />
            <Route path="atividades/:slug" element={<ActivityStagePage />} />
            {moduleRoutes.map((key) => (
              <Route key={key} path={key} element={<ModulePage moduleKey={key} />} />
            ))}
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
