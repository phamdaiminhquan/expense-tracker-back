import React, { useEffect, useState } from 'react';
import { CreateFirstWalletScreen } from './welcome/CreateFirstWalletScreen';
import { CreateFirstFundScreen } from './welcome/CreateFirstFundScreen';
import { User } from '@/lib/auth';
import { FundType } from '@/lib/types';
import { Fund } from '@/apis/funds/fund.entities';

interface WelcomeScreenProps {
  userName?: string;
  walletData?: any;
  onWalletMutate?: () => Promise<any>;
  onCreateFund?: (name: string, type: FundType) => Promise<void>;
  currentUserId?: string;
  allUsers?: User[];
  onComplete?: () => void;
  onLogout?: () => void;
  funds?: Fund[];
  isLoadingFunds?: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  userName,
  walletData,
  onWalletMutate,
  onCreateFund,
  currentUserId,
  allUsers,
  onComplete,
  onLogout,
  funds = [],
  isLoadingFunds = false
}) => {
  const [showWalletScreen, setShowWalletScreen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('mustCreateWallet') === 'true';
  });
  
  const [showFundScreen, setShowFundScreen] = useState(() => {
    if (typeof window === 'undefined') return false;
    const wallet = localStorage.getItem('mustCreateWallet') === 'true';
    return !wallet && localStorage.getItem('mustCreateFund') === 'true';
  });

  const checkFlags = (triggerComplete = true) => {
    const mustCreateWallet = localStorage.getItem('mustCreateWallet') === 'true';
    const mustCreateFund = localStorage.getItem('mustCreateFund') === 'true';

    if (mustCreateWallet) {
      setShowWalletScreen(true);
      setShowFundScreen(false);
    } else if (mustCreateFund) {
      setShowWalletScreen(false);
      setShowFundScreen(true);
    } else {
      setShowWalletScreen(false);
      setShowFundScreen(false);
      if (triggerComplete && onComplete) onComplete();
    }
  };

  useEffect(() => {
    // Wait for data to load
    if (isLoadingFunds || !walletData) {
        return;
    }

    const hasWallets = walletData.data && walletData.data.length > 0;
    const hasFunds = funds.length > 0;

    // Check and set localStorage flags
    if (!hasWallets) {
      localStorage.setItem('mustCreateWallet', 'true');
    } else {
      localStorage.setItem('mustCreateWallet', 'false');
    }

    if (!hasFunds) {
      localStorage.setItem('mustCreateFund', 'true');
    } else {
      localStorage.setItem('mustCreateFund', 'false');
    }

    // Don't trigger onComplete from useEffect to avoid loops
    checkFlags(false);
    
  }, [walletData, funds, isLoadingFunds]);

  const handleWalletComplete = () => {
    localStorage.setItem('mustCreateWallet', 'false');
    checkFlags(true);
  };

  const handleFundComplete = () => {
    localStorage.setItem('mustCreateFund', 'false');
    checkFlags(true);
  };

  if (showWalletScreen) {
    return (
      <CreateFirstWalletScreen
        userName={userName}
        walletData={walletData}
        onWalletMutate={onWalletMutate}
        onComplete={handleWalletComplete}
        onLogout={onLogout}
      />
    );
  }

  if (showFundScreen) {
    return (
      <CreateFirstFundScreen
        onCreateFund={onCreateFund}
        currentUserId={currentUserId}
        allUsers={allUsers}
        onComplete={handleFundComplete}
        onLogout={onLogout}
      />
    );
  }

  return null;
};
