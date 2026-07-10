"use client";

import React, { useState } from 'react';
import { useApp, Address } from '../../components/AppContext';
import { Breadcrumb } from '../../components/UIComponents';
import { User, MapPin, ShieldAlert, KeyRound, Sliders, LogOut } from 'lucide-react';
import { AddressCard } from '../../components/InfoCards';

export default function ProfilePage() {
  const { currentUser, logout, addresses, deleteAddress, setDefaultAddress, addAddress, updateAddress, isDarkMode, toggleDarkMode, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'info' | 'address' | 'password' | 'preferences'>('info');

  // Personal Info Form
  const [name, setName] = useState(currentUser?.name || "Jane Doe");
  const [email, setEmail] = useState(currentUser?.email || "jane@example.com");
  const [phone, setPhone] = useState(currentUser?.phone || "");

  // Password Form
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  // Address inline add/edit state
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrForm, setAddrForm] = useState({ fullName: "", street: "", city: "", state: "", zip: "", country: "United States", phone: "", isDefault: false });

  const handleUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Profile Updated", "Your changes have been saved successfully.", "success");
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }
    showToast("Password Updated", "Your security credentials have been updated.", "success");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddress) {
      updateAddress({ ...addrForm, id: editingAddress.id });
    } else {
      addAddress(addrForm);
    }
    setShowAddressForm(false);
    setEditingAddress(null);
    setAddrForm({ fullName: "", street: "", city: "", state: "", zip: "", country: "United States", phone: "", isDefault: false });
  };

  const handleEditAddressClick = (addr: Address) => {
    setEditingAddress(addr);
    setAddrForm(addr);
    setShowAddressForm(true);
  };

  const handleDeleteAccount = () => {
    const confirm = window.confirm("Are you sure you want to permanently delete your account?");
    if (confirm) {
      logout();
      window.location.href = '/';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      <Breadcrumb items={[{ name: "My Profile" }]} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Account Settings</h1>
          <p className="text-xs text-zinc-400">Manage your credentials, shipping configurations, and preferences.</p>
        </div>
        <button
          onClick={logout}
          className="text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 py-2.5 px-4 rounded-xl border border-red-200 dark:border-red-900/60 flex items-center gap-1.5 transition-all"
        >
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Sidebar Tabs Select */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-3xl p-4 flex flex-col gap-1.5">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2.5 text-xs font-bold py-2.5 px-4 rounded-xl text-left transition-all ${activeTab === 'info' ? 'bg-indigo-50/50 text-indigo-650 dark:bg-indigo-950/20 dark:text-indigo-400' : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}
          >
            <User className="w-4 h-4" /> Personal Info
          </button>
          <button
            onClick={() => setActiveTab('address')}
            className={`flex items-center gap-2.5 text-xs font-bold py-2.5 px-4 rounded-xl text-left transition-all ${activeTab === 'address' ? 'bg-indigo-50/50 text-indigo-650 dark:bg-indigo-950/20 dark:text-indigo-400' : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}
          >
            <MapPin className="w-4 h-4" /> Address Book
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex items-center gap-2.5 text-xs font-bold py-2.5 px-4 rounded-xl text-left transition-all ${activeTab === 'password' ? 'bg-indigo-50/50 text-indigo-650 dark:bg-indigo-950/20 dark:text-indigo-400' : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}
          >
            <KeyRound className="w-4 h-4" /> Change Password
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-2.5 text-xs font-bold py-2.5 px-4 rounded-xl text-left transition-all ${activeTab === 'preferences' ? 'bg-indigo-50/50 text-indigo-650 dark:bg-indigo-950/20 dark:text-indigo-400' : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}
          >
            <Sliders className="w-4 h-4" /> Preferences
          </button>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-3xl p-6 sm:p-8">
          
          {/* 1. Personal Info Tab */}
          {activeTab === 'info' && (
            <form onSubmit={handleUpdateInfo} className="space-y-6">
              <h3 className="font-extrabold text-base text-zinc-900 dark:text-white pb-3 border-b border-zinc-150">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-650 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 rounded-xl py-3 px-4 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-650 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 rounded-xl py-3 px-4 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-650 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-55 dark:bg-zinc-800 border border-zinc-200 rounded-xl py-3 px-4 text-xs outline-none"
                />
              </div>
              <button type="submit" className="bg-indigo-650 hover:bg-indigo-705 text-white font-extrabold text-xs py-3 px-6 rounded-xl transition-all">
                Save Changes
              </button>
            </form>
          )}

          {/* 2. Address Book Tab */}
          {activeTab === 'address' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-zinc-150">
                <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">Shipping Addresses</h3>
                {!showAddressForm && (
                  <button
                    onClick={() => {
                      setEditingAddress(null);
                      setShowAddressForm(true);
                    }}
                    className="text-xs font-bold text-indigo-655"
                  >
                    + Add New Address
                  </button>
                )}
              </div>

              {showAddressForm ? (
                <form onSubmit={handleAddressSubmit} className="space-y-4 p-4 border border-zinc-200 dark:border-zinc-850 rounded-2xl bg-zinc-50 dark:bg-zinc-950/20">
                  <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-200">
                    {editingAddress ? "Edit Address details" : "Add New Address"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Receiver name"
                      required
                      value={addrForm.fullName}
                      onChange={(e) => setAddrForm({ ...addrForm, fullName: e.target.value })}
                      className="w-full bg-white dark:bg-zinc-800 border border-zinc-250 rounded-xl py-2 px-3 text-xs outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      required
                      value={addrForm.phone}
                      onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })}
                      className="w-full bg-white dark:bg-zinc-800 border border-zinc-250 rounded-xl py-2 px-3 text-xs outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Street, suite, flat"
                    required
                    value={addrForm.street}
                    onChange={(e) => setAddrForm({ ...addrForm, street: e.target.value })}
                    className="w-full bg-white dark:bg-zinc-800 border border-zinc-250 rounded-xl py-2 px-3 text-xs outline-none"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      required
                      value={addrForm.city}
                      onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                      className="bg-white dark:bg-zinc-800 border border-zinc-250 rounded-xl py-2 px-3 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      required
                      value={addrForm.state}
                      onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })}
                      className="bg-white dark:bg-zinc-800 border border-zinc-250 rounded-xl py-2 px-3 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Zip"
                      required
                      value={addrForm.zip}
                      onChange={(e) => setAddrForm({ ...addrForm, zip: e.target.value })}
                      className="bg-white dark:bg-zinc-800 border border-zinc-250 rounded-xl py-2 px-3 text-xs"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={addrForm.isDefault}
                      onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })}
                      className="w-4 h-4 rounded border border-zinc-200 accent-indigo-650"
                    />
                    <span className="text-xs text-zinc-550 dark:text-zinc-400 font-medium">Set as primary shipping address</span>
                  </label>
                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressForm(false);
                        setEditingAddress(null);
                      }}
                      className="text-xs font-bold text-zinc-400 py-2 px-4 rounded-xl hover:bg-zinc-100"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2 px-4 rounded-xl shadow-md">
                      Save Details
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map(addr => (
                    <AddressCard
                      key={addr.id}
                      address={addr}
                      onEdit={handleEditAddressClick}
                      onDelete={deleteAddress}
                      onSetDefault={setDefaultAddress}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Change Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <h3 className="font-extrabold text-base text-zinc-900 dark:text-white pb-3 border-b border-zinc-150">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-650 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 rounded-xl py-3 px-4 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-650 mb-1.5">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 rounded-xl py-3 px-4 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-650 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 rounded-xl py-3 px-4 text-xs outline-none"
                  />
                </div>
              </div>
              <button type="submit" className="bg-indigo-650 hover:bg-indigo-705 text-white font-extrabold text-xs py-3 px-6 rounded-xl transition-all">
                Update credentials
              </button>
            </form>
          )}

          {/* 4. Preferences Settings Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-8">
              <h3 className="font-extrabold text-base text-zinc-900 dark:text-white pb-3 border-b border-zinc-150">Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">Dark Theme Mode</span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">Toggle site dark color layout.</span>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className={`w-11 h-6 rounded-full relative transition-all duration-300 ${isDarkMode ? 'bg-indigo-600' : 'bg-zinc-200'}`}
                  >
                    <span className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${isDarkMode ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              </div>

              {/* Danger zone delete */}
              <div className="p-6 border border-red-200/50 bg-red-50/20 dark:border-red-950/40 dark:bg-red-950/10 rounded-2xl space-y-4">
                <div className="flex gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <span className="font-extrabold text-red-650 dark:text-red-400 block">Delete Account</span>
                    <span className="text-zinc-500 dark:text-zinc-400 mt-1 block">Deleting your account is permanent. All design canvas setups, wishlist saves, and order invoices history ledger will be deleted forever.</span>
                  </div>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-2 px-4 rounded-xl transition-colors shadow"
                >
                  Delete My Account
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
