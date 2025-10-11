'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, DollarSign, Clock, Save, X } from 'lucide-react';
import { Service } from '@/lib/bookingTypes';
import { SERVICES } from '@/lib/bookingConfig';

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Service>>({
    id: '',
    name: '',
    price: 0,
    duration: 60,
    description: '',
    requiresDeposit: false,
    depositAmount: 0,
  });

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData(service);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      id: `service-${Date.now()}`,
      name: '',
      price: 0,
      duration: 60,
      description: '',
      requiresDeposit: false,
      depositAmount: 0,
    });
  };

  const handleSave = () => {
    if (isAdding) {
      setServices([...services, formData as Service]);
    } else if (editingId) {
      setServices(services.map(s => s.id === editingId ? formData as Service : s));
    }
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      id: '',
      name: '',
      price: 0,
      duration: 60,
      description: '',
      requiresDeposit: false,
      depositAmount: 0,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      id: '',
      name: '',
      price: 0,
      duration: 60,
      description: '',
      requiresDeposit: false,
      depositAmount: 0,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const handleChange = (field: keyof Service, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-playfair font-light mb-2">Services Management</h2>
          <p className="text-graphite/70">Add, edit, or remove services from your booking system</p>
        </div>
        <button
          onClick={handleAdd}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Service
        </button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-6 bg-sage/5 rounded-xl border-2 border-sage"
        >
          <h3 className="font-semibold text-graphite mb-4">
            {isAdding ? 'Add New Service' : 'Edit Service'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Service Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-mist rounded-lg focus:outline-none focus:ring-2 focus:ring-sage/20"
                placeholder="e.g., Precision Cut"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Price (£) *</label>
              <div className="relative">
                <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite/40" />
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange('price', Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 border border-mist rounded-lg focus:outline-none focus:ring-2 focus:ring-sage/20"
                  placeholder="65"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Duration (minutes) *</label>
              <div className="relative">
                <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite/40" />
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 border border-mist rounded-lg focus:outline-none focus:ring-2 focus:ring-sage/20"
                  placeholder="60"
                  step="15"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Deposit Amount (£)</label>
              <input
                type="number"
                value={formData.depositAmount}
                onChange={(e) => handleChange('depositAmount', Number(e.target.value))}
                className="w-full px-4 py-2 border border-mist rounded-lg focus:outline-none focus:ring-2 focus:ring-sage/20"
                placeholder="0"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-mist rounded-lg focus:outline-none focus:ring-2 focus:ring-sage/20 resize-none"
                placeholder="Perfect for maintaining shape and creating wearable styles..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requiresDeposit}
                  onChange={(e) => handleChange('requiresDeposit', e.target.checked)}
                  className="w-4 h-4 text-sage border-mist rounded focus:ring-sage/20"
                />
                <span className="text-sm font-medium">Requires deposit to secure booking</span>
              </label>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleSave}
              className="btn-primary flex items-center gap-2"
            >
              <Save size={18} />
              Save Service
            </button>
            <button
              onClick={handleCancel}
              className="btn-secondary flex items-center gap-2"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Services List */}
      <div className="space-y-4">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-6 border border-mist rounded-xl hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-graphite">{service.name}</h3>
                  {service.requiresDeposit && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      Deposit Required
                    </span>
                  )}
                </div>
                <p className="text-sm text-graphite/70 mb-3">{service.description}</p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1 text-graphite/60">
                    <DollarSign size={16} />
                    <span className="font-semibold text-sage">£{service.price}</span>
                  </div>
                  <div className="flex items-center gap-1 text-graphite/60">
                    <Clock size={16} />
                    <span>{service.duration} mins</span>
                  </div>
                  {service.requiresDeposit && (
                    <div className="text-graphite/60">
                      <span className="text-xs">Deposit: £{service.depositAmount}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="p-2 hover:bg-sage/10 rounded-lg transition-colors"
                  title="Edit Service"
                >
                  <Edit size={18} className="text-graphite/60" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Service"
                >
                  <Trash2 size={18} className="text-red-500" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12">
          <p className="text-graphite/60">No services yet. Click "Add Service" to get started.</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> Changes made here are currently stored in memory. 
          To persist changes, connect to a database in production.
        </p>
      </div>
    </div>
  );
}
