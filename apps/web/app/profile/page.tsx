"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useApp, Address } from '../../components/AppContext';
import { Breadcrumb } from '../../components/UIComponents';
import { User, MapPin, ShieldAlert, KeyRound, Sliders, LogOut, LayoutDashboard, Upload, Camera, X } from 'lucide-react';
import { AddressCard } from '../../components/InfoCards';
import { getApiUrl } from '../../components/ApiConfig';

export default function ProfilePage() {
  const { 
    currentUser, 
    logout, 
    addresses, 
    deleteAddress, 
    setDefaultAddress, 
    addAddress, 
    updateAddress, 
    showToast, 
    updateUserProfile,
    updateUserPreferences
  } = useApp();
  const [activeTab, setActiveTab] = useState<'info' | 'address' | 'password' | 'preferences'>('info');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Personal Info Form
  const [name, setName] = useState(currentUser?.name || "Jane Doe");
  const [email, setEmail] = useState(currentUser?.email || "jane@example.com");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [avatar, setAvatar] = useState(currentUser?.avatar || "");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preferences form state
  const [prefOrderEmail, setPrefOrderEmail] = useState(currentUser?.preferences?.orderEmail ?? true);
  const [prefNewsletter, setPrefNewsletter] = useState(currentUser?.preferences?.newsletter ?? false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setPhone(currentUser.phone || "");
      setAvatar(currentUser.avatar || "");
      setPrefOrderEmail(currentUser.preferences?.orderEmail ?? true);
      setPrefNewsletter(currentUser.preferences?.newsletter ?? false);
    }
  }, [currentUser]);

  // Password Form
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  // Address inline add/edit state
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrForm, setAddrForm] = useState({ fullName: "", street: "", city: "", state: "", zip: "", country: "United States", phone: "", isDefault: false });

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile(name, avatar, phone);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatar(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      showToast("Error", "New passwords do not match!", "error");
      return;
    }
    const token = localStorage.getItem("token");
    fetch(getApiUrl("/user/profile/change-password"), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ current: passwords.current, new: passwords.new })
    })
    .then(async res => {
      const data = await res.json();
      if (res.ok) {
        showToast("Password Updated", "Your password has been changed successfully.", "success");
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        throw new Error(data.message || "Failed to update password");
      }
    })
    .catch(err => {
      showToast("Error", err.message || "Could not change password.", "error");
    });
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8 pb-10 md:pb-16">
      <Breadcrumb items={[{ name: "My Profile" }]} />

      {/* MOBILE SIDEBAR DRAWER OVERLAY */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex !m-0 top-0">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
          />
          {/* Drawer Content */}
          <div className="relative w-72 max-w-[80vw] bg-white dark:bg-zinc-900 h-full flex flex-col p-5 shadow-2xl z-10 animate-slide-from-left">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200/50 dark:border-zinc-800">
              <h3 className="font-extrabold text-sm text-zinc-800 dark:text-white">Account Menu</h3>
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1.5">
              <button
                onClick={() => { setActiveTab('info'); setIsMobileSidebarOpen(false); }}
                className={`flex items-center gap-2.5 text-xs font-bold py-2.5 px-4 rounded-lg text-left transition-all ${activeTab === 'info' ? 'bg-[#FBD5C1]/30 text-[#E8855A]' : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}
              >
                <User className="w-4 h-4" /> Personal Info
              </button>
              <button
                onClick={() => { setActiveTab('address'); setIsMobileSidebarOpen(false); }}
                className={`flex items-center gap-2.5 text-xs font-bold py-2.5 px-4 rounded-lg text-left transition-all ${activeTab === 'address' ? 'bg-[#FBD5C1]/30 text-[#E8855A]' : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}
              >
                <MapPin className="w-4 h-4" /> Address Book
              </button>
              <button
                onClick={() => { setActiveTab('password'); setIsMobileSidebarOpen(false); }}
                className={`flex items-center gap-2.5 text-xs font-bold py-2.5 px-4 rounded-lg text-left transition-all ${activeTab === 'password' ? 'bg-[#FBD5C1]/30 text-[#E8855A]' : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}
              >
                <KeyRound className="w-4 h-4" /> Change Password
              </button>
              <button
                onClick={() => { setActiveTab('preferences'); setIsMobileSidebarOpen(false); }}
                className={`flex items-center gap-2.5 text-xs font-bold py-2.5 px-4 rounded-lg text-left transition-all ${activeTab === 'preferences' ? 'bg-[#FBD5C1]/30 text-[#E8855A]' : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}
              >
                <Sliders className="w-4 h-4" /> Preferences
              </button>
              
              {currentUser?.role === 'admin' && (
                <div className="border-t border-[#E8E2D6] my-1.5 pt-1.5">
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="flex items-center gap-2.5 text-xs font-extrabold py-2.5 px-4 rounded-lg text-left transition-all text-[#F9A37E] hover:bg-[#FBD5C1]/10"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Admin Console
                  </Link>
                </div>
              )}

              <div className="border-t border-zinc-200/50 dark:border-zinc-800 my-1.5 pt-1.5">
                <button
                  onClick={() => { logout(); setIsMobileSidebarOpen(false); }}
                  className="w-full flex items-center gap-2.5 text-xs font-bold py-2.5 px-4 rounded-lg text-left transition-all text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Trigger Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="w-full flex items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3.5 text-xs font-bold text-zinc-750 dark:text-zinc-300 shadow-sm hover:border-[#F9A37E] transition-colors"
        >
          <span className="flex items-center gap-2">
            {activeTab === 'info' && <><User className="w-4.5 h-4.5 text-[#E8855A]" /> Personal Info</>}
            {activeTab === 'address' && <><MapPin className="w-4.5 h-4.5 text-[#E8855A]" /> Address Book</>}
            {activeTab === 'password' && <><KeyRound className="w-4.5 h-4.5 text-[#E8855A]" /> Change Password</>}
            {activeTab === 'preferences' && <><Sliders className="w-4.5 h-4.5 text-[#E8855A]" /> Preferences</>}
          </span>
          <span className="text-[10px] text-[#e8855a] font-extrabold uppercase tracking-wider flex items-center gap-1">
            Menu ➔
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8 items-start">
        
        {/* Sidebar Tabs Select - Desktop Only */}
        <div className="hidden lg:flex bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-lg p-4 flex-col gap-1.5 w-full">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2.5 text-xs font-bold py-2.5 px-4 rounded-lg text-left transition-all ${activeTab === 'info' ? 'bg-[#FBD5C1]/30 text-[#E8855A]' : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}
          >
            <User className="w-4 h-4" /> Personal Info
          </button>
          <button
            onClick={() => setActiveTab('address')}
            className={`flex items-center gap-2.5 text-xs font-bold py-2.5 px-4 rounded-lg text-left transition-all ${activeTab === 'address' ? 'bg-[#FBD5C1]/30 text-[#E8855A]' : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}
          >
            <MapPin className="w-4 h-4" /> Address Book
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex items-center gap-2.5 text-xs font-bold py-2.5 px-4 rounded-lg text-left transition-all ${activeTab === 'password' ? 'bg-[#FBD5C1]/30 text-[#E8855A]' : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}
          >
            <KeyRound className="w-4 h-4" /> Change Password
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-2.5 text-xs font-bold py-2.5 px-4 rounded-lg text-left transition-all ${activeTab === 'preferences' ? 'bg-[#FBD5C1]/30 text-[#E8855A]' : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}
          >
            <Sliders className="w-4 h-4" /> Preferences
          </button>
          
          {currentUser?.role === 'admin' && (
            <div className="border-t border-[#E8E2D6] my-1.5 pt-1.5">
              <Link
                href="/admin"
                className="flex items-center gap-2.5 text-xs font-extrabold py-2.5 px-4 rounded-lg text-left transition-all text-[#F9A37E] hover:bg-[#FBD5C1]/10"
              >
                <LayoutDashboard className="w-4 h-4" /> Admin Console
              </Link>
            </div>
          )}

          <div className="border-t border-zinc-200/50 dark:border-zinc-800 my-1.5 pt-1.5">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2.5 text-xs font-bold py-2.5 px-4 rounded-lg text-left transition-all text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-lg p-6 sm:p-8">
          
          {/* 1. Personal Info Tab */}
          {activeTab === 'info' && (
            <form onSubmit={handleUpdateInfo} className="space-y-6">
              <h3 className="font-extrabold text-base text-zinc-900 dark:text-white pb-3 border-b border-zinc-150">Personal Information</h3>
              
              {/* Avatar Upload */}
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#FBD5C1] bg-zinc-100 flex items-center justify-center font-black text-xl text-[#7A736A] shadow-sm">
                    {avatar ? (
                      <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-1.5 bg-[#F9A37E] hover:bg-[#E8855A] text-white rounded-full shadow transition-all hover:scale-110"
                    title="Change Avatar"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-800">Avatar Image</h4>
                  <p className="text-[10px] text-zinc-400 mt-1">Upload a custom square avatar for your creator profile.</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 text-[10px] font-extrabold text-[#F9A37E] hover:text-[#E8855A] flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" /> Upload Image
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-650 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 rounded-lg py-3 px-4 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-650 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 rounded-lg py-3 px-4 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-650 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-55 dark:bg-zinc-800 border border-zinc-200 rounded-lg py-3 px-4 text-xs outline-none"
                />
              </div>
              <button type="submit" className="bg-[#F9A37E] hover:bg-[#E8855A] text-white font-extrabold text-xs py-3 px-6 rounded-lg transition-all">
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
                    className="text-xs font-bold text-[#F9A37E] hover:text-[#E8855A] transition-colors"
                  >
                    + Add New Address
                  </button>
                )}
              </div>

              {showAddressForm ? (
                <form onSubmit={handleAddressSubmit} className="space-y-4 p-4 border border-zinc-200 dark:border-zinc-850 rounded-lg bg-zinc-50 dark:bg-zinc-950/20">
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
                      className="w-full bg-white dark:bg-zinc-800 border border-zinc-250 rounded-lg py-2 px-3 text-xs outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      required
                      value={addrForm.phone}
                      onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })}
                      className="w-full bg-white dark:bg-zinc-800 border border-zinc-250 rounded-lg py-2 px-3 text-xs outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Street, suite, flat"
                    required
                    value={addrForm.street}
                    onChange={(e) => setAddrForm({ ...addrForm, street: e.target.value })}
                    className="w-full bg-white dark:bg-zinc-800 border border-zinc-250 rounded-lg py-2 px-3 text-xs outline-none"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      required
                      value={addrForm.city}
                      onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                      className="bg-white dark:bg-zinc-800 border border-zinc-250 rounded-lg py-2 px-3 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      required
                      value={addrForm.state}
                      onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })}
                      className="bg-white dark:bg-zinc-800 border border-zinc-250 rounded-lg py-2 px-3 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Zip"
                      required
                      value={addrForm.zip}
                      onChange={(e) => setAddrForm({ ...addrForm, zip: e.target.value })}
                      className="bg-white dark:bg-zinc-800 border border-zinc-250 rounded-lg py-2 px-3 text-xs"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={addrForm.isDefault}
                      onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })}
                      className="w-4 h-4 rounded border border-zinc-200 accent-indigo-600"
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
                      className="text-xs font-bold text-zinc-400 py-2 px-4 rounded-lg hover:bg-zinc-100"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="bg-[#F9A37E] hover:bg-[#E8855A] text-white font-extrabold text-xs py-2 px-4 rounded-lg shadow-md">
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
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 rounded-lg py-3 px-4 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-650 mb-1.5">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 rounded-lg py-3 px-4 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-650 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 rounded-lg py-3 px-4 text-xs outline-none"
                  />
                </div>
              </div>
              <button type="submit" className="bg-[#F9A37E] hover:bg-[#E8855A] text-white font-extrabold text-xs py-3 px-6 rounded-lg transition-all">
                Update credentials
              </button>
            </form>
          )}

          {/* 4. Preferences Settings Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-8">
              <h3 className="font-extrabold text-base text-zinc-900 dark:text-white pb-3 border-b border-zinc-150">Preferences</h3>

              <form onSubmit={(e) => { e.preventDefault(); updateUserPreferences({ orderEmail: prefOrderEmail, newsletter: prefNewsletter }); }} className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer p-4 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={prefOrderEmail}
                    onChange={(e) => setPrefOrderEmail(e.target.checked)}
                    className="w-4 h-4 rounded border border-zinc-200 accent-[#F9A37E] mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-zinc-800 block">Order Status Emails</span>
                    <span className="text-[10px] text-zinc-400 mt-1 block">Receive real-time automated updates regarding print statuses and courier delivery tracking.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer p-4 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={prefNewsletter}
                    onChange={(e) => setPrefNewsletter(e.target.checked)}
                    className="w-4 h-4 rounded border border-zinc-200 accent-[#F9A37E] mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-zinc-800 block">Marketing Newsletter</span>
                    <span className="text-[10px] text-zinc-400 mt-1 block">Subscribe to our newsletter for exclusive drops, holiday sales, and special product customizer design ideas.</span>
                  </div>
                </label>

                <button type="submit" className="bg-[#F9A37E] hover:bg-[#E8855A] text-white font-extrabold text-xs py-2.5 px-6 rounded-lg transition-colors shadow-sm">
                  Save Preferences
                </button>
              </form>

              {/* Danger zone delete */}
              <div className="p-6 border border-red-200/50 bg-red-50/20 dark:border-red-950/40 dark:bg-red-950/10 rounded-lg space-y-4">
                <div className="flex gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <span className="font-extrabold text-red-650 dark:text-red-400 block">Delete Account</span>
                    <span className="text-zinc-500 dark:text-zinc-400 mt-1 block">Deleting your account is permanent. All design canvas setups, wishlist saves, and order invoices history ledger will be deleted forever.</span>
                  </div>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-2 px-4 rounded-lg transition-colors shadow"
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
