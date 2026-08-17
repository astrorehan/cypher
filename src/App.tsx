import React, { useState } from 'react';
import { DotField } from './components/site/DotField';
import { SiteHeader } from './components/site/SiteHeader';
import { LandingView } from './views/LandingView';
import { SimulationView } from './views/SimulationView';
import { NationalHubView } from './views/NationalHubView';
import { MethodologyView } from './views/MethodologyView';
import { ProfileView } from './views/ProfileView';
import { AboutView } from './views/AboutView';
import { SiteView } from './engine/cypherTypes';
import { SoundProvider } from './utils/SoundProvider';

export default function App() {
  const [view, setView] = useState<SiteView>('landing');

  return (
    <SoundProvider>
      <div className="min-h-screen w-full flex flex-col bg-stage relative overflow-x-hidden">
        {/* Radial Aurora Glows */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(80% 55% at 18% 0%, rgba(47,75,220,.09), transparent 60%), radial-gradient(70% 55% at 88% 100%, rgba(10,154,134,.08), transparent 62%)',
          }}
        />

        <DotField />

        <SiteHeader view={view} onNavigate={setView} />

        <div className="flex-1 flex flex-col relative z-10">
          {view === 'landing' && <LandingView onNavigate={setView} />}
          {view === 'simulasi' && (
            <SimulationView
              onHome={() => setView('landing')}
              onNavigateToNational={() => setView('nasional')}
            />
          )}
          {view === 'nasional' && <NationalHubView onNavigate={setView} />}
          {view === 'metodologi' && <MethodologyView onNavigate={setView} />}
          {view === 'profil' && <ProfileView onNavigate={setView} />}
          {view === 'tentang' && <AboutView onNavigate={setView} />}
        </div>
      </div>
    </SoundProvider>
  );
}
