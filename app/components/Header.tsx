"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { LoginModal } from "./LoginModal";
import { RegisterModal } from "./RegisterModal";

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);

  return (
    <>
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Image
                  src="/svg/logo.svg"
                  alt="Casino Lobby"
                  width={30}
                  height={30}
                  priority
                />
                <h1 className="text-xl lg:text-3xl font-bold text-gray-900">Casino Lobby</h1>
              </div>
              <div>
                <p className="text-sm lg:text-base mt-0 text-gray-600">
                  Browse and play our premium selection of casino games
                </p>
              </div>
            </div>

            {/* Auth Section */}
            <div className="flex items-center gap-4">
              {isAuthenticated && user ? (
                <>
                  <div className="hidden items-center gap-4 sm:flex">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name || user.username}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={logout}
                      className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </div>

                  <button
                    onClick={() => setShowProfilePanel(true)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 sm:hidden"
                    aria-label="Open profile"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21a8 8 0 0 0-16 0" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  <div className="hidden gap-2 sm:flex">
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => setShowRegisterModal(true)}
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      Sign Up
                    </button>
                  </div>

                  <button
                    onClick={() => setShowProfilePanel(true)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 sm:hidden"
                    aria-label="Open menu"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21a8 8 0 0 0-16 0" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 sm:hidden transition-opacity duration-300 ${
          showProfilePanel ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!showProfilePanel}
      >
        <button
          className="absolute inset-0 bg-black/40"
          onClick={() => setShowProfilePanel(false)}
          aria-label="Close profile"
        />
        <div
          className={`absolute right-0 top-0 h-full w-72 bg-white p-6 shadow-xl transition-transform duration-300 ${
            showProfilePanel ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              {isAuthenticated && user ? (
                <>
                  <p className="text-sm font-medium text-gray-900">
                    {user.name || user.username}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </>
              ) : (
                <p className="text-sm font-medium text-gray-900">Welcome</p>
              )}
            </div>
            <button
              onClick={() => setShowProfilePanel(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {isAuthenticated && user ? (
              <button
                onClick={() => {
                  setShowProfilePanel(false);
                  logout();
                }}
                className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setShowProfilePanel(false);
                    setShowLoginModal(true);
                  }}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setShowProfilePanel(false);
                    setShowRegisterModal(true);
                  }}
                  className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </>
  );
}
