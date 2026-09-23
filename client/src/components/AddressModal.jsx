import React, { useState } from 'react';
import { useCraveStore } from '../store/useCraveStore';

export default function AddressModal() {
  const {
    isAddressModalOpen,
    toggleAddressModal,
    addresses,
    selectedAddress,
    setSelectedAddress,
    addAddress
  } = useCraveStore();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Home',
    flatNo: '',
    apartment: '',
    street: '',
    landmark: '',
    instructions: 'Leave at door'
  });

  if (!isAddressModalOpen) return null;

  const handleSubmitNew = (e) => {
    e.preventDefault();
    if (!formData.flatNo || !formData.street) return;
    addAddress(formData);
    setIsAddingNew(false);
    setFormData({ title: 'Home', flatNo: '', apartment: '', street: '', landmark: '', instructions: '' });
  };

  const instructionPills = [
    { id: 'no-bell', label: "🔕 Don't ring bell" },
    { id: 'security', label: "🚪 Leave food with security / at door" },
    { id: 'call-before', label: "📞 Call before coming" },
    { id: 'pet', label: '🐾 Pet in house' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-crave-espresso/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden border border-crave-border flex flex-col max-h-[90vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-crave-border flex items-center justify-between bg-crave-flameLight">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-crave-flame/10 flex items-center justify-center text-crave-flame shrink-0">
              <span className="material-symbols-outlined text-[20px]">location_on</span>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-crave-wasabi font-bold">
                BENGALURU METRO • 3 Service Hubs
              </span>
              <h2 className="font-serif text-xl font-bold text-crave-espresso">
                Choose Delivery Location
              </h2>
            </div>
          </div>

          <button
            onClick={() => toggleAddressModal(false)}
            className="w-8 h-8 rounded-full bg-white hover:bg-crave-creamLow flex items-center justify-center text-crave-espresso border border-crave-border transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs uppercase tracking-wider text-crave-sand font-bold">
              YOUR SAVED DELIVERY ADDRESSES
            </h3>
            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="font-body text-xs text-crave-flame hover:underline font-bold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">add_location_alt</span>
              <span>{isAddingNew ? 'Cancel' : '+ Add New Address'}</span>
            </button>
          </div>

          {/* Form */}
          {isAddingNew && (
            <form onSubmit={handleSubmitNew} className="p-4 rounded-2xl bg-crave-creamLow border border-crave-flame/30 space-y-3">
              <h4 className="font-serif text-sm font-bold text-crave-espresso">New Delivery Location</h4>
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Flat / House No. *"
                  required
                  value={formData.flatNo}
                  onChange={(e) => setFormData({ ...formData, flatNo: e.target.value })}
                  className="h-9 px-3 rounded-xl bg-white text-crave-espresso text-xs border border-crave-border focus:outline-none focus:ring-2 focus:ring-crave-flame/30"
                />
                <input
                  type="text"
                  placeholder="Building / Apartment"
                  value={formData.apartment}
                  onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                  className="h-9 px-3 rounded-xl bg-white text-crave-espresso text-xs border border-crave-border focus:outline-none focus:ring-2 focus:ring-crave-flame/30"
                />
              </div>

              <input
                type="text"
                placeholder="Street / Area *"
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full h-9 px-3 rounded-xl bg-white text-crave-espresso text-xs border border-crave-border focus:outline-none focus:ring-2 focus:ring-crave-flame/30"
              />

              <div className="flex flex-wrap gap-2 pt-1">
                {instructionPills.map((pill) => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, instructions: pill.label })}
                    className={`px-3 py-1 rounded-full font-body text-xs transition-colors border ${
                      formData.instructions === pill.label
                        ? 'bg-crave-flame text-white border-crave-flame font-bold'
                        : 'bg-white text-crave-espresso border-crave-border'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-crave-flame text-white font-body text-xs font-bold shadow-md hover:bg-crave-flameDark transition-colors"
              >
                Save Delivery Address
              </button>
            </form>
          )}

          {/* Saved Addresses Cards */}
          <div className="space-y-3">
            {addresses.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-crave-creamLow border border-dashed border-crave-border space-y-2">
                <span className="material-symbols-outlined text-[32px] text-crave-flame">location_off</span>
                <p className="font-serif text-sm font-bold text-crave-espresso">No saved delivery addresses</p>
                <p className="font-body text-xs text-crave-sand max-w-xs mx-auto">
                  Click "+ Add New Address" above to enter your delivery location.
                </p>
              </div>
            ) : (
              addresses.map((addr) => {
                const isSelected = selectedAddress?.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      isSelected
                        ? 'bg-crave-flameLight border-crave-flame ring-1 ring-crave-flame/30 shadow-sm'
                        : 'bg-white border-crave-border hover:bg-crave-creamLow/50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-crave-flame text-[18px]">home</span>
                        <span className="font-serif text-sm font-bold text-crave-espresso">
                          {addr.title}
                        </span>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-full bg-crave-wasabiBg text-crave-wasabi font-mono text-[9px] font-bold">
                            • Selected
                          </span>
                        )}
                      </div>
                      <p className="font-body text-xs text-crave-sand leading-relaxed">
                        {addr.address}
                      </p>
                      {addr.note && (
                        <div className="flex items-center gap-1 text-crave-sand font-mono text-[10px] pt-1">
                          <span className="material-symbols-outlined text-[12px] text-crave-flame">shield</span>
                          <span>Note: {addr.note}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAddress(addr.id);
                      }}
                      className={`px-4 h-9 rounded-xl font-body text-xs font-bold transition-colors shrink-0 shadow-sm ${
                        isSelected
                          ? 'bg-crave-flame text-white'
                          : 'bg-crave-creamLow text-crave-espresso hover:bg-crave-border'
                      }`}
                    >
                      {isSelected ? '✓ Deliver Here' : 'Select'}
                    </button>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
