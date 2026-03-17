import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { FiCamera, FiStar, FiClock, FiLogOut, FiChevronRight } from 'react-icons/fi';
import './ProfilePage.css';

/**
 * Retorna o artigo correto ("do" ou "da") baseado no gênero.
 *  - male   → "do"
 *  - female → "da"
 *  - outro  → "de"
 */
function getArticle(gender) {
  if (gender === 'male') return 'do';
  if (gender === 'female') return 'da';
  return 'de';
}

/**
 * Monta o texto "Mamãe do João e da Maria"
 */
function buildChildrenLabel(children) {
  if (!children || children.length === 0) return null;

  const parts = children.map(
    (child) => `${getArticle(child.gender)} ${child.name}`
  );

  if (parts.length === 1) return `Mamãe ${parts[0]}`;
  const last = parts.pop();
  return `Mamãe ${parts.join(', ')} e ${last}`;
}

/**
 * Calcula dias restantes do plano
 */
function daysRemaining(expiresAt) {
  if (!expiresAt) return 0;
  const diff = new Date(expiresAt) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function ProfilePage() {
  const { user, signOut, refreshProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [children, setChildren] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // ── Fetch profile + children ──
  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      setLoading(true);

      const [profileRes, childrenRes] = await Promise.all([
        supabase
          .from('users_profiles')
          .select('name, email, avatar_url, plan, plan_expires_at')
          .eq('id', user.id)
          .single(),
        supabase
          .from('children')
          .select('name, gender')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true }),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (childrenRes.data) setChildren(childrenRes.data);

      setLoading(false);
    }

    fetchData();
  }, [user]);

  // ── Upload avatar ──
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      setUploading(false);
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const avatarUrl = urlData.publicUrl;

    // Update profile
    await supabase
      .from('users_profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', user.id);

    await refreshProfile(user.id);
    setUploading(false);
  };

  // ── Plan logic ──
  const isPremium =
    profile?.plan === 'premium' &&
    profile?.plan_expires_at &&
    new Date(profile.plan_expires_at) > new Date();

  const remaining = daysRemaining(profile?.plan_expires_at);
  const progressPercent = isPremium ? Math.round((remaining / 30) * 100) : 0;

  const handleLogout = async () => {
    await signOut();
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner" />
      </div>
    );
  }

  const childrenLabel = buildChildrenLabel(children);

  return (
    <div className="profile-page animate-fade-in">
      {/* ── Avatar Section ── */}
      <section className="profile-hero">
        <div className="avatar-wrapper" onClick={() => fileInputRef.current?.click()}>
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Foto de perfil"
              className="avatar-img"
            />
          ) : (
            <div className="avatar-placeholder">
              <span>👩</span>
            </div>
          )}
          <div className={`avatar-camera ${uploading ? 'uploading' : ''}`}>
            {uploading ? <div className="mini-spinner" /> : <FiCamera />}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleAvatarUpload}
            className="avatar-input"
          />
        </div>

        <h1 className="profile-name">{profile?.name || 'Mamãe'}</h1>

        {childrenLabel && (
          <p className="profile-children-label">{childrenLabel} 💕</p>
        )}
      </section>

      {/* ── Cards Section ── */}
      <section className="profile-cards">
        {/* Plan Card */}
        <div className={`profile-card plan-card ${isPremium ? 'premium' : 'free'}`}>
          <div className="plan-card-header">
            <div className="plan-card-icon">
              {isPremium ? <FiStar /> : <FiClock />}
            </div>
            <div className="plan-card-info">
              <span className="plan-card-label">Plano</span>
              <span className={`plan-badge ${isPremium ? 'badge-premium' : 'badge-free'}`}>
                {isPremium ? '⭐ Premium' : 'Gratuito'}
              </span>
            </div>
            <FiChevronRight className="plan-card-arrow" />
          </div>

          {isPremium ? (
            <div className="plan-details">
              <div className="plan-expiry">
                <FiClock />
                <span>
                  {remaining} {remaining === 1 ? 'dia restante' : 'dias restantes'}
                </span>
              </div>
              <div className="plan-progress-track">
                <div
                  className="plan-progress-bar"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="plan-expiry-date">
                Expira em {new Date(profile.plan_expires_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          ) : (
            <div className="plan-details">
              <p className="plan-upgrade-text">
                Tenha acesso a todos os recursos exclusivos!
              </p>
              <button className="btn btn-primary plan-upgrade-btn">
                Seja Premium ⭐
              </button>
            </div>
          )}
        </div>

        {/* Logout Card */}
        <button className="profile-card logout-card" onClick={handleLogout}>
          <FiLogOut />
          <span>Sair da conta</span>
        </button>
      </section>
    </div>
  );
}
