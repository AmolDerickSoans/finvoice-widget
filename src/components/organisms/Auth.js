import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
);

const AuthPage = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        // Notify background script of successful auth
        chrome.runtime.sendMessage({ type: 'AUTH_SUCCESS' });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session) {
    return <div className="p-4">Authenticated! Closing window...</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Welcome to Trade Tracker</h1>
        <p className="text-gray-600">Please sign in to continue</p>
      </div>
      
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google']}
        theme="light"
        socialLayout="vertical"
      />
    </div>
  );
};

export default AuthPage;