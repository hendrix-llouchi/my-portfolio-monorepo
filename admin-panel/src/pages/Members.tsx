import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Users, Search, Shield } from 'lucide-react';
import api from '../lib/api';

interface Member {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await api.get(`/users?t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await api.put(`/users/${editingMember.id}`, formData);
        alert('Member updated successfully!');
      } else {
        await api.post('/users', formData);
        alert('Member added successfully!');
      }

      setShowModal(false);
      setEditingMember(null);
      resetForm();
      await fetchMembers();
    } catch (error: any) {
      console.error('Error saving member:', error);
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Error saving member. Please try again.';
      
      if (error.response?.data?.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat().join(', ');
        alert(`Validation errors: ${validationErrors}`);
      } else {
        alert(errorMessage);
      }
    }
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      password: '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this member? This action cannot be undone.')) return;

    try {
      await api.delete(`/users/${id}`);
      await fetchMembers();
      alert('Member deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting member:', error);
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Error deleting member. Please try again.';
      alert(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
    });
  };

  const openAddModal = () => {
    setEditingMember(null);
    resetForm();
    setShowModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Members</h1>
        <p className="text-gray-600 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Shield className="w-6 h-6 mr-2 text-blue-600" />
          User Management & Access Levels
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search members by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          >
            <option>All Roles</option>
            <option>Admin</option>
            <option>User</option>
          </select>
          <button
            onClick={openAddModal}
            className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Member
          </button>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No members found' : 'No members yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? 'Try adjusting your search criteria' : 'Get started by adding your first member'}
            </p>
            {!searchQuery && (
              <button
                onClick={openAddModal}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Member
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Joined</th>
                  <th className="text-right py-4 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold mr-3">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{member.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{member.email}</td>
                    <td className="py-4 px-4">
                      {member.email_verified_at ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          Verified
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">{formatDate(member.created_at)}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(member)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingMember ? 'Edit Member' : 'Add New Member'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingMember(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password {!editingMember && <span className="text-red-500">*</span>}
                  {editingMember && <span className="text-gray-500 text-xs">(leave blank to keep current password)</span>}
                </label>
                <input
                  type="password"
                  required={!editingMember}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder={editingMember ? "New password (optional)" : "Password (min 8 characters)"}
                  minLength={editingMember ? 0 : 8}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingMember(null);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg font-medium transition-all duration-200"
                >
                  {editingMember ? 'Update Member' : 'Create Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
