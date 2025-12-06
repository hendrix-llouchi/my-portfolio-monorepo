import { useState, useEffect } from 'react';
import { Save, User, FileText, Link as LinkIcon, Trash2 } from 'lucide-react';
import api from '../lib/api';

interface Profile {
  id: number;
  name: string;
  headline: string;
  sub_headline: string | null;
  short_bio: string | null;
  avatar_url: string | null;
  resume_url: string | null;
  linkedin: string | null;
  github: string | null;
  status_text: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    sub_headline: '',
    short_bio: '',
    status_text: 'System Online',
    linkedin: '',
    github: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [deleteAvatar, setDeleteAvatar] = useState(false);
  const [deleteResume, setDeleteResume] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      const data = response.data;
      setProfile(data);
      setFormData({
        name: data.name || '',
        headline: data.headline || '',
        sub_headline: data.sub_headline || '',
        short_bio: data.short_bio || '',
        status_text: data.status_text || 'System Online',
        linkedin: data.linkedin || '',
        github: data.github || '',
      });
      // Set avatar preview - construct full URL if it's a relative path
      if (data.avatar_url) {
        let previewUrl = data.avatar_url;
        if (!previewUrl.startsWith('http')) {
          // It's a relative path like 'storage/profile/file.jpg', construct full URL
          previewUrl = `http://127.0.0.1:8000/${previewUrl}`;
        }
        setAvatarPreview(previewUrl);
      } else {
        setAvatarPreview(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setDeleteAvatar(false); // Reset delete flag when new file is selected
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      setDeleteResume(false); // Reset delete flag when new file is selected
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('headline', formData.headline);
      formDataToSend.append('sub_headline', formData.sub_headline);
      formDataToSend.append('short_bio', formData.short_bio);
      formDataToSend.append('status_text', formData.status_text);
      formDataToSend.append('linkedin', formData.linkedin);
      formDataToSend.append('github', formData.github);

      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile);
      }
      if (resumeFile) {
        formDataToSend.append('resume', resumeFile);
      }
      
      // Add delete flags
      if (deleteAvatar) {
        formDataToSend.append('delete_avatar', 'true');
      }
      if (deleteResume) {
        formDataToSend.append('delete_resume', 'true');
      }

      const response = await api.post('/profile', formDataToSend);
      const updatedProfile = response.data;
      setProfile(updatedProfile);
      setAvatarFile(null);
      setResumeFile(null);
      setDeleteAvatar(false);
      setDeleteResume(false);
      // Update avatar preview - construct full URL if needed
      if (updatedProfile.avatar_url) {
        let previewUrl = updatedProfile.avatar_url;
        if (!previewUrl.startsWith('http')) {
          // It's a relative path, construct full URL
          previewUrl = `http://127.0.0.1:8000/${previewUrl}`;
        }
        setAvatarPreview(`${previewUrl}?t=${Date.now()}`);
      } else {
        setAvatarPreview(null);
      }
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Failed to update profile. Please try again.';
      
      if (error.response?.data?.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat().join(', ');
        alert(`Validation errors: ${validationErrors}`);
      } else {
        alert(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Text Fields */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Software Engineer | Full-Stack & Mobile Dev"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub Headline
                  </label>
                  <input
                    type="text"
                    value={formData.sub_headline}
                    onChange={(e) => setFormData({ ...formData, sub_headline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Machine Learning • Data Science • AI"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Bio
                  </label>
                  <textarea
                    value={formData.short_bio}
                    onChange={(e) => setFormData({ ...formData, short_bio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Building scalable apps and intelligent solutions."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status Text
                  </label>
                  <input
                    type="text"
                    value={formData.status_text}
                    onChange={(e) => setFormData({ ...formData, status_text: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="System Online"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <LinkIcon className="w-5 h-5 mr-2" />
                Social Links
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - File Uploads & Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Avatar
              </h2>
              
              <div className="space-y-4">
                {avatarPreview && !deleteAvatar && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Current Avatar:</p>
                    <div className="relative">
                      <img
                        src={avatarPreview.startsWith('http') 
                          ? avatarPreview 
                          : `http://127.0.0.1:8000/${avatarPreview}`}
                        alt="Avatar preview"
                        className="w-48 h-48 object-cover rounded-lg border border-gray-300"
                        onError={(e) => {
                          console.error('Avatar preview failed to load:', avatarPreview);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this avatar?')) {
                            setDeleteAvatar(true);
                            setAvatarPreview(null);
                            setAvatarFile(null);
                          }
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                        title="Delete avatar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
                
                {deleteAvatar && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      Avatar will be deleted when you save the profile.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteAvatar(false);
                        setAvatarPreview(profile?.avatar_url || null);
                      }}
                      className="mt-2 text-sm text-yellow-800 hover:text-yellow-900 underline"
                    >
                      Cancel deletion
                    </button>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload New Avatar
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml"
                    onChange={handleAvatarChange}
                    disabled={deleteAvatar}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Accepted: JPEG, PNG, JPG, GIF, SVG (Max 2MB)</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Resume
              </h2>
              
              <div className="space-y-4">
                {profile?.resume_url && !deleteResume && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Current Resume:</p>
                    <div className="flex items-center gap-2">
                      <a
                        href={profile.resume_url.startsWith('http') 
                          ? profile.resume_url 
                          : `http://127.0.0.1:8000/${profile.resume_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Current Resume
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this resume?')) {
                            setDeleteResume(true);
                          }
                        }}
                        className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        title="Delete resume"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
                
                {deleteResume && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      Resume will be deleted when you save the profile.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteResume(false);
                      }}
                      className="mt-2 text-sm text-yellow-800 hover:text-yellow-900 underline"
                    >
                      Cancel deletion
                    </button>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload New Resume
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                    disabled={deleteResume}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Accepted: PDF, DOC, DOCX (Max 5MB)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}

