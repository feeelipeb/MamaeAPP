import React, { useState, useEffect } from 'react';
import './InstallManager.css';

const InstallManager = ({ children }) => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [platform, setPlatform] = useState(''); // 'ios', 'android', or ''
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        window.navigator.standalone || 
                        document.referrer.includes('android-app://');
    
    setIsInstalled(isStandalone);

    // Detect Platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isMobile = isIos || isAndroid;

    if (isMobile && !isStandalone) {
      setPlatform(isIos ? 'ios' : 'android');
      setShowInstallPrompt(true);
    }

    // Capture Android Install Prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (isAndroid && !isStandalone) {
        setShowInstallPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  if (isInstalled) {
    return children;
  }

  if (showInstallPrompt) {
    return (
      <div className="install-overlay">
        <div className="install-card animate-pop-in">
          <div className="install-header">
            <img src="/logo2.png" alt="MamãeAPP" className="install-logo" />
            <h2>Instale o MamãeAPP</h2>
            <p>Para continuar, adicione o aplicativo à sua tela de início.</p>
          </div>

          {platform === 'android' ? (
            <div className="android-instructions">
              <button className="btn-install-auto" onClick={handleAndroidInstall}>
                Instalar Agora
              </button>
              <p className="install-note">Rápido, seguro e ocupa pouco espaço.</p>
            </div>
          ) : (
            <div className="ios-instructions">
              <div className="ios-step">
                <div className="step-icon-wrapper">
                  <img src="/ios_share_icon.png" alt="Compartilhar" className="step-icon" />
                </div>
                <p>1. Toque no botão de <strong>Compartilhar</strong> na barra do Safari.</p>
              </div>
              <div className="ios-step">
                <div className="step-icon-wrapper">
                  <img src="/ios_add_home_icon.png" alt="Adicionar" className="step-icon" />
                </div>
                <p>2. Role para baixo e selecione <strong>Adicionar à Tela de Início</strong>.</p>
              </div>
              <p className="install-note-ios">Após adicionar, abra o app pela sua tela inicial.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fallback for desktop or non-mobile (unrestricted)
  return children;
};

export default InstallManager;
