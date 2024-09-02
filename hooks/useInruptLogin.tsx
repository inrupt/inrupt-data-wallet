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
import React, { createContext, useState } from "react";
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
  const [visible, setVisible] = useState(false);
  const [modalRequestMode, setModalRequestMode] = useState<
    "login" | "blank" | "logout"
  >("blank");
  const { signIn, signOut } = useSession();

  const handleLoginSuccess = () => {
    setVisible(false);
    signIn();
    router.replace("/home");
    setModalRequestMode("blank");
  };

  const handleLogoutSuccess = () => {
    setVisible(false);
    signOut();
    router.replace("/login");
    setModalRequestMode("blank");
  };

  const handleCloseModal = () => {
    setVisible(false);
    setModalRequestMode("blank");
  };

  return (
    <LoginWebViewContext.Provider
      value={{
        showLoginPage: () => {
          setVisible(true);
          setModalRequestMode("login");
        },
        requestLogout: () => {
          setVisible(false);
          setModalRequestMode("logout");
        },
      }}
    >
      {children}
      <LoginWebViewModal
        requestMode={modalRequestMode}
        visible={visible}
        onLoginSuccess={handleLoginSuccess}
        onLogoutSuccess={handleLogoutSuccess}
        onClose={handleCloseModal}
      />
    </LoginWebViewContext.Provider>
  );
};

export const useLoginWebView = () => React.useContext(LoginWebViewContext);
