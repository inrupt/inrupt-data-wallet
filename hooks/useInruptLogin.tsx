//
// Copyright Inrupt Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
import React, { createContext, useCallback, useState } from "react";
import LoginWebViewModal from "@/components/login/LoginWebViewModal";
import { useSession } from "@/hooks/session";
import { router } from "expo-router";

const LoginWebViewContext = createContext<{
  showLoginPage: () => void;
  requestLogout: () => void;
}>({
  showLoginPage: () => null,
  requestLogout: () => null,
});

export const LoginWebViewProvider = ({ children }: React.PropsWithChildren) => {
  const [modalRequestMode, setModalRequestMode] = useState<
    "login" | "logout" | "blank"
  >("blank");
  const { signIn, signOut } = useSession();

  const handleLoginSuccess = () => {
    signIn();
    closeModal();
    router.replace("/home");
  };

  const handleLogoutSuccess = () => {
    signOut();
    closeModal();
    router.replace("/login");
  };

  const closeModal = () => {
    setModalRequestMode("blank");
  };

  const showLoginPage = useCallback(() => {
    setModalRequestMode("login");
  }, []);

  const requestLogout = useCallback(() => {
    setModalRequestMode("logout");
  }, []);

  return (
    <LoginWebViewContext.Provider
      value={{
        showLoginPage,
        requestLogout,
      }}
    >
      {children}
      <LoginWebViewModal
        requestMode={modalRequestMode}
        onLoginSuccess={handleLoginSuccess}
        onLogoutSuccess={handleLogoutSuccess}
        onClose={handleLogoutSuccess}
      />
    </LoginWebViewContext.Provider>
  );
};

export const useLoginWebView = () => React.useContext(LoginWebViewContext);
