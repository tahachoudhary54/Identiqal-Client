'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createOrgSchema, inviteMemberSchema } from '@/validators/organization.validator.js';
import { orgService } from '@/services/orgService.js';
import { cardService } from '@/services/cardService.js';
import { useAuthStore } from '@/store/authStore.js';
import { Input } from '@/components/ui/Input.jsx';
import {
  Users,
  Plus,
  Mail,
  UserCheck,
  ShieldAlert,
  Sparkles,
  Lock,
  Building2,
  Crown,
  ChevronRight,
} from 'lucide-react';

export default function TeamWorkspacePage() {
  const { user, updateUser } = useAuthStore();
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  const {
    register: registerOrg,
    handleSubmit: handleSubmitOrg,
    formState: { errors: orgErrors },
  } = useForm({ resolver: yupResolver(createOrgSchema) });

  const {
    register: registerInvite,
    handleSubmit: handleSubmitInvite,
    reset: resetInvite,
    formState: { errors: inviteErrors },
  } = useForm({ resolver: yupResolver(inviteMemberSchema) });

  const fetchOrgDetails = async () => {
    if (!user.organizationId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await cardService.getTheme();
      setOrg({
        _id: user.organizationId,
        name: 'Workspace Organization',
        seatLimit: 10,
        seatsUsed: 1,
        members: [
          { userId: user.id, email: user.email, role: 'owner', status: 'active' }
        ],
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgDetails();
  }, [user.organizationId]);

  const handleCreateOrg = async (data) => {
    setIsCreatingOrg(true);
    setErrorMsg('');
    try {
      const response = await orgService.createOrg(data.name, data.logoUrl);
      if (response.success) {
        updateUser({ organizationId: response.data._id, role: 'owner' });
        setOrg(response.data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create workspace');
    } finally {
      setIsCreatingOrg(false);
    }
  };

  const handleInvite = async (data) => {
    setIsInviting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const response = await orgService.inviteMember(org._id, data.email, data.role);
      if (response.success) {
        setSuccessMsg(`Invitation successfully sent to ${data.email}!`);
        resetInvite();
        setOrg((prev) => ({
          ...prev,
          seatsUsed: prev.seatsUsed + 1,
          members: [...prev.members, { email: data.email, role: data.role, status: 'invited' }],
        }));
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invitation failed (check seat limits/subscriptions)');
    } finally {
      setIsInviting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#5A3342] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="pb-6 border-b border-[#E9E2DC]">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#C89B5B]">Collaboration</span>
        <h1 className="text-2xl font-black text-inherit mt-1">Team Workspace</h1>
        <p className="text-xs text-[#8A7A6A] mt-1">Configure shared templates and invite organization members.</p>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center space-x-2">
          <ShieldAlert size={15} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-xs flex items-center space-x-2">
          <UserCheck size={15} className="shrink-0 animate-pulse" />
          <span>{successMsg}</span>
        </div>
      )}

      {!org ? (
        /* Create Org Callout */
        <div className="bg-white border border-[#E9E2DC] rounded-3xl p-10 space-y-6 max-w-xl mx-auto text-center relative overflow-hidden shadow-sm shadow-[#5A3342]/3">
          <div className="absolute top-0 right-0 w-56 h-56 bg-[#C89B5B]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#5A3342] to-[#7A4A5E] rounded-2xl flex items-center justify-center mx-auto text-[#C89B5B] shadow-md shadow-[#5A3342]/20">
              <Building2 size={28} />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-black text-inherit">Create a Team Workspace</h2>
              <p className="text-xs text-[#8A7A6A] leading-relaxed max-w-sm mx-auto">
                Unlock centralized branding locks, aggregated team reports, and collaborative seat allocations.
              </p>
            </div>

            <form onSubmit={handleSubmitOrg(handleCreateOrg)} className="space-y-4 text-left border-t border-[#E9E2DC] pt-6">
              <Input
                label="Organization Name"
                placeholder="eg. Acme Corp"
                error={orgErrors.name?.message}
                {...registerOrg('name')}
              />
              <Input
                label="Logo Image URL (Optional)"
                placeholder="https://company.com/logo.png"
                error={orgErrors.logoUrl?.message}
                {...registerOrg('logoUrl')}
              />
              <button
                type="submit"
                disabled={isCreatingOrg}
                className="w-full py-3 bg-[#5A3342] hover:bg-[#6A3B4B] text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-sm shadow-[#5A3342]/20"
              >
                {isCreatingOrg ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus size={13} />
                    <span>Create Workspace</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-12 gap-6">
          {/* Member List */}
          <div className="md:col-span-7 space-y-5">
            <div className="bg-white border border-[#E9E2DC] rounded-2xl p-6 space-y-4 shadow-sm shadow-[#5A3342]/3">
              <div className="flex items-center justify-between border-b border-[#F0E8E0] pb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-[#5A3342]/5 flex items-center justify-center">
                    <Users size={13} className="text-[#5A3342]" />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[#8A7A6A]">Workspace Members</h3>
                </div>
                <span className="text-[9px] bg-[#FAF8F6] border border-[#E9E2DC] text-[#8A7A6A] px-3 py-1 rounded-full font-black">
                  {org.seatsUsed} / {org.seatLimit} seats
                </span>
              </div>

              <div className="space-y-3">
                {org.members.map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 bg-[#FAF8F6] border border-[#E9E2DC] rounded-xl hover:border-[#5A3342]/20 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5A3342] to-[#7A4A5E] flex items-center justify-center text-white font-black text-xs shrink-0">
                        {member.email?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-inherit">{member.email}</h5>
                        <span className="text-[9px] text-[#C89B5B] font-semibold capitalize">{member.role}</span>
                      </div>
                    </div>
                    <span className={`text-[8px] border px-2.5 py-0.5 rounded-full uppercase font-black tracking-wider ${
                      member.status === 'active'
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-amber-50 border-amber-200 text-amber-700'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Invitation Form */}
          <div className="md:col-span-5 space-y-5">
            <div className="bg-white border border-[#E9E2DC] rounded-2xl p-6 space-y-4 shadow-sm shadow-[#5A3342]/3">
              <div className="flex items-center space-x-2 border-b border-[#F0E8E0] pb-4">
                <div className="w-7 h-7 rounded-lg bg-[#C89B5B]/10 flex items-center justify-center">
                  <Mail size={13} className="text-[#C89B5B]" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#8A7A6A]">Invite Member</h3>
              </div>

              <form onSubmit={handleSubmitInvite(handleInvite)} className="space-y-4">
                <Input
                  label="Email Address"
                  placeholder="name@company.com"
                  error={inviteErrors.email?.message}
                  {...registerInvite('email')}
                />
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#8A7A6A]">Workspace Role</label>
                  <select
                    className="bg-[#FAF8F6] border border-[#E9E2DC] rounded-xl text-xs p-2.5 text-inherit focus:outline-none focus:border-[#5A3342]/40 transition-colors font-semibold"
                    {...registerInvite('role')}
                  >
                    <option value="member">Member (Own Card Edit Only)</option>
                    <option value="owner">Owner (Full admin controls)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isInviting}
                  className="w-full py-2.5 bg-[#5A3342] hover:bg-[#6A3B4B] text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-sm shadow-[#5A3342]/20"
                >
                  {isInviting ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Mail size={13} />
                      <span>Send Invitation</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Styling lock info */}
            <div className="p-5 bg-gradient-to-br from-[#FAF8F6] to-[#FDF4E8] border border-[#C89B5B]/20 rounded-2xl flex items-start space-x-3">
              <div className="w-9 h-9 bg-[#C89B5B]/10 rounded-xl flex items-center justify-center shrink-0">
                <Lock size={15} className="text-[#C89B5B]" />
              </div>
              <div className="space-y-0.5">
                <h5 className="text-xs font-black text-[#5A3342]">Centralized theme locks</h5>
                <p className="text-[9px] text-[#8A7A6A] leading-relaxed">
                  All invited members automatically render using the locked team theme configuration set in Theme Controls.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
