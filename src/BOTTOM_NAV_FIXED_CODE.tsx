// COPY THIS ENTIRE SECTION AND REPLACE YOUR BOTTOM NAVIGATION (around line 1799)
// ================================================================================

      {/* Bottom Navigation - Fixed & Aligned */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center relative bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 rounded-[28px] p-2.5 shadow-inner">
            {/* Animated floating indicator with perfect alignment */}
            <div 
              className="absolute h-[60px] bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 rounded-[22px] transition-all duration-500 ease-out"
              style={{
                left: `${
                  currentTab === 'home' ? '2.5%' :
                  currentTab === 'rewards' ? '18.5%' :
                  currentTab === 'finance' ? '35%' :
                  currentTab === 'services' ? '51.5%' :
                  currentTab === 'activity' ? '68%' :
                  '84.5%'
                }`,
                width: '14%',
                top: '50%',
                transform: 'translateY(-50%)',
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4), 0 0 20px rgba(16, 185, 129, 0.3)',
              }}
            />
            
            {/* HOME BUTTON */}
            <button
              onClick={() => setCurrentTab('home')}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all duration-300 relative z-10 active:scale-95 min-w-[60px]"
            >
              <div className="relative flex items-center justify-center w-[26px] h-[26px]">
                <HomeIcon className={`w-full h-full transition-all duration-300 ${
                  currentTab === 'home' 
                    ? 'text-white scale-110 drop-shadow-[0_2px_8px_rgba(255,255,255,0.5)]' 
                    : 'text-gray-500 hover:text-gray-700 hover:scale-105'
                }`} />
              </div>
              <span className={`text-[10px] font-bold transition-all duration-300 tracking-tight whitespace-nowrap ${
                currentTab === 'home' 
                  ? 'text-white opacity-100' 
                  : 'text-gray-600 opacity-70'
              }`}>
                Home
              </span>
            </button>

            {/* REWARDS BUTTON */}
            <button
              onClick={() => setCurrentTab('rewards')}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all duration-300 relative z-10 active:scale-95 min-w-[60px]"
            >
              <div className="relative flex items-center justify-center w-[26px] h-[26px]">
                <RewardsIcon className={`w-full h-full transition-all duration-300 ${
                  currentTab === 'rewards' 
                    ? 'text-white scale-110 drop-shadow-[0_2px_8px_rgba(255,255,255,0.5)]' 
                    : 'text-gray-500 hover:text-gray-700 hover:scale-105'
                }`} />
                {/* Notification badge */}
                <span className={`absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full transition-all duration-300 ${
                  currentTab === 'rewards' ? 'opacity-0 scale-0' : 'opacity-100 scale-100 animate-pulse'
                }`} />
              </div>
              <span className={`text-[10px] font-bold transition-all duration-300 tracking-tight whitespace-nowrap ${
                currentTab === 'rewards' 
                  ? 'text-white opacity-100' 
                  : 'text-gray-600 opacity-70'
              }`}>
                Rewards
              </span>
            </button>

            {/* FINANCE BUTTON */}
            <button
              onClick={() => setCurrentTab('finance')}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all duration-300 relative z-10 active:scale-95 min-w-[60px]"
            >
              <div className="relative flex items-center justify-center w-[26px] h-[26px]">
                <WalletIcon className={`w-full h-full transition-all duration-300 ${
                  currentTab === 'finance' 
                    ? 'text-white scale-110 drop-shadow-[0_2px_8px_rgba(255,255,255,0.5)]' 
                    : 'text-gray-500 hover:text-gray-700 hover:scale-105'
                }`} />
              </div>
              <span className={`text-[10px] font-bold transition-all duration-300 tracking-tight whitespace-nowrap ${
                currentTab === 'finance' 
                  ? 'text-white opacity-100' 
                  : 'text-gray-600 opacity-70'
              }`}>
                Finance
              </span>
            </button>

            {/* SERVICES BUTTON */}
            <button
              onClick={() => setCurrentTab('services')}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all duration-300 relative z-10 active:scale-95 min-w-[60px]"
            >
              <div className="relative flex items-center justify-center w-[26px] h-[26px]">
                <ChartIcon className={`w-full h-full transition-all duration-300 ${
                  currentTab === 'services' 
                    ? 'text-white scale-110 drop-shadow-[0_2px_8px_rgba(255,255,255,0.5)]' 
                    : 'text-gray-500 hover:text-gray-700 hover:scale-105'
                }`} />
              </div>
              <span className={`text-[10px] font-bold transition-all duration-300 tracking-tight whitespace-nowrap ${
                currentTab === 'services' 
                  ? 'text-white opacity-100' 
                  : 'text-gray-600 opacity-70'
              }`}>
                Services
              </span>
            </button>

            {/* ACTIVITY BUTTON */}
            <button
              onClick={() => setCurrentTab('activity')}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all duration-300 relative z-10 active:scale-95 min-w-[60px]"
            >
              <div className="relative flex items-center justify-center w-[26px] h-[26px]">
                <History className={`w-full h-full transition-all duration-300 ${
                  currentTab === 'activity' 
                    ? 'text-white fill-white scale-110 drop-shadow-[0_2px_8px_rgba(255,255,255,0.5)]' 
                    : 'text-gray-500 hover:text-gray-700 hover:scale-105'
                }`} />
              </div>
              <span className={`text-[10px] font-bold transition-all duration-300 tracking-tight whitespace-nowrap ${
                currentTab === 'activity' 
                  ? 'text-white opacity-100' 
                  : 'text-gray-600 opacity-70'
              }`}>
                Activity
              </span>
            </button>

            {/* PROFILE BUTTON */}
            <button
              onClick={() => setCurrentTab('profile')}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all duration-300 relative z-10 active:scale-95 min-w-[60px]"
            >
              <div className="relative flex items-center justify-center w-[26px] h-[26px]">
                <UserIcon className={`w-full h-full transition-all duration-300 ${
                  currentTab === 'profile' 
                    ? 'text-white fill-white scale-110 drop-shadow-[0_2px_8px_rgba(255,255,255,0.5)]' 
                    : 'text-gray-500 hover:text-gray-700 hover:scale-105'
                }`} />
              </div>
              <span className={`text-[10px] font-bold transition-all duration-300 tracking-tight whitespace-nowrap ${
                currentTab === 'profile' 
                  ? 'text-white opacity-100' 
                  : 'text-gray-600 opacity-70'
              }`}>
                Profile
              </span>
            </button>
          </div>
        </div>
      </div>

// ================================================================================
// END OF BOTTOM NAVIGATION - COPY ABOVE CODE
// ================================================================================

/* 
  KEY FEATURES OF THIS REDESIGN:
  
  ✅ Perfect Alignment:
  - All icons are exactly 26x26px
  - Icon containers use flex centering (items-center justify-center)
  - min-w-[60px] ensures equal button widths
  - whitespace-nowrap prevents text wrapping
  
  ✅ Creative Design:
  - Gradient background container (gray-50 → gray-100 → gray-50)
  - Pulsing yellow badge on Rewards tab
  - Enhanced glow on active state
  - Smooth 500ms transitions
  - Shadow-inner for depth
  
  ✅ Responsive:
  - Fixed position at bottom
  - z-50 ensures it's always on top
  - Backdrop blur for glassmorphic effect
  - Active scale-95 on tap
  
  ✅ Accessibility:
  - High contrast colors
  - 44x44px touch targets (py-3 + icon size)
  - Clear active states
  - Smooth animations
  
  HOW TO USE:
  1. Find the bottom navigation section in Dashboard.tsx (around line 1799)
  2. Delete the old navigation code
  3. Paste this entire section
  4. Make sure all imports are present at top of file
  5. Save and refresh!
*/
