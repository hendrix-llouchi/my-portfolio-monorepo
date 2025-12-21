import { useState, useEffect } from 'react';
import { Save, User, FileText, Link as LinkIcon, Trash2, X, Upload, Github, Linkedin } from 'lucide-react';
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
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [deleteAvatar, setDeleteAvatar] = useState(false);
  const [deleteResume, setDeleteResume] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/profile?t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
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
      if (data.avatar_url) {
        let previewUrl = data.avatar_url;
        if (!previewUrl.startsWith('http')) {
          previewUrl = `http://127.0.0.1:8000/${previewUrl}`;
        }
        previewUrl = previewUrl.includes('?') 
          ? `${previewUrl.split('?')[0]}?t=${Date.now()}`
          : `${previewUrl}?t=${Date.now()}`;
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
      setDeleteAvatar(false);
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
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const validExtensions = ['.pdf', '.doc', '.docx'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
        alert('Please upload a valid file (PDF, DOC, or DOCX)');
        e.target.value = ''; // Reset input
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        e.target.value = ''; // Reset input
        return;
      }
      
      setResumeFile(file);
      setResumeFileName(file.name);
      setDeleteResume(false);
    } else {
      setResumeFile(null);
      setResumeFileName(null);
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
      setResumeFileName(null);
      setDeleteAvatar(false);
      setDeleteResume(false);
      if (updatedProfile.avatar_url) {
        let previewUrl = updatedProfile.avatar_url;
        if (!previewUrl.startsWith('http')) {
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your personal information and portfolio details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Profile Picture
              </h2>
              
              <div className="space-y-4">
                {avatarPreview && !deleteAvatar && (
                  <div className="relative">
                    <img
                      src={avatarPreview.startsWith('http') 
                        ? avatarPreview 
                        : `http://127.0.0.1:8000/${avatarPreview}`}
                      alt="Avatar preview"
                      className="w-full aspect-square object-cover rounded-xl border-2 border-gray-200"
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
                      className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                      title="Delete avatar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {deleteAvatar && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                    <p className="text-sm text-orange-800 mb-2">
                      Avatar will be deleted when you save.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteAvatar(false);
                        setAvatarPreview(profile?.avatar_url || null);
                      }}
                      className="text-sm text-orange-800 hover:text-orange-900 font-medium underline"
                    >
                      Cancel deletion
                    </button>
                  </div>
                )}
                
                <div>
                  <label
                    htmlFor="avatar-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600 font-medium">
                      {avatarFile ? 'Change avatar' : 'Upload avatar'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">JPEG, PNG, GIF up to 2MB</span>
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml"
                    onChange={handleAvatarChange}
                    disabled={deleteAvatar}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="space-y-5">
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
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Headline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Software Engineer | Full-Stack & Mobile Dev"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sub Headline
                  </label>
                  <input
                    type="text"
                    value={formData.sub_headline}
                    onChange={(e) => setFormData({ ...formData, sub_headline: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Machine Learning • Data Science • AI"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Short Bio
                  </label>
                  <textarea
                    value={formData.short_bio}
                    onChange={(e) => setFormData({ ...formData, short_bio: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    rows={4}
                    placeholder="Building scalable apps and intelligent solutions."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status Text
                  </label>
                  <input
                    type="text"
                    value={formData.status_text}
                    onChange={(e) => setFormData({ ...formData, status_text: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="System Online"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <LinkIcon className="w-5 h-5 mr-2 text-blue-600" />
                Social Links
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Github className="w-4 h-4 mr-2 text-gray-900" />
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Resume
              </h2>
              
              <div className="space-y-4">
                {profile?.resume_url && !deleteResume && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Current Resume</p>
                          <p className="text-xs text-gray-600">Click to view</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={profile.resume_url.startsWith('http') 
                            ? profile.resume_url 
                            : `http://127.0.0.1:8000/${profile.resume_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          View
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this resume?')) {
                              setDeleteResume(true);
                            }
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4 inline mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {deleteResume && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                    <p className="text-sm text-orange-800 mb-2">
                      Resume will be deleted when you save.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteResume(false);
                      }}
                      className="text-sm text-orange-800 hover:text-orange-900 font-medium underline"
                    >
                      Cancel deletion
                    </button>
                  </div>
                )}
                
                {resumeFile && !deleteResume && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Selected File</p>
                          <p className="text-xs text-gray-600">{resumeFileName}</p>
                          <p className="text-xs text-gray-500">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setResumeFile(null);
                          setResumeFileName(null);
                          const input = document.getElementById('resume-upload') as HTMLInputElement;
                          if (input) input.value = '';
                        }}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
                
                <div>
                  <label
                    htmlFor="resume-upload"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                      resumeFile 
                        ? 'border-green-400 bg-green-50' 
                        : 'border-gray-300 bg-gray-50 hover:border-blue-400'
                    }`}
                  >
                    <Upload className={`w-8 h-8 mb-2 ${resumeFile ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${resumeFile ? 'text-green-700' : 'text-gray-600'}`}>
                      {resumeFile ? 'Change resume' : 'Upload resume'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 5MB</span>
                  </label>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleResumeChange}
                    disabled={deleteResume}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
