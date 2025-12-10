import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Image as ImageIcon, ExternalLink, Github } from 'lucide-react';
import api from '../lib/api';

interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string[];
  image_url: string | null;
  demo_link: string | null;
  repo_link: string | null;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tech_stack: '',
    image_url: '',
    demo_link: '',
    repo_link: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (editingProject && showModal) {
      setFormData({
        title: editingProject.title || '',
        description: editingProject.description || '',
        tech_stack: Array.isArray(editingProject.tech_stack) 
          ? editingProject.tech_stack.join(', ') 
          : (editingProject.tech_stack || ''),
        image_url: editingProject.image_url || '',
        demo_link: editingProject.demo_link || '',
        repo_link: editingProject.repo_link || '',
      });
      setImagePreview(editingProject.image_url || null);
      setImageFile(null);
      setRemoveImage(false);
    }
  }, [editingProject?.id, showModal]);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const form = e.currentTarget;
      const formElements = form.elements;
      
      const titleInput = formElements.namedItem('title') as HTMLInputElement;
      const descriptionInput = formElements.namedItem('description') as HTMLTextAreaElement;
      const techStackInput = formElements.namedItem('tech_stack') as HTMLInputElement;
      const demoLinkInput = formElements.namedItem('demo_link') as HTMLInputElement;
      const repoLinkInput = formElements.namedItem('repo_link') as HTMLInputElement;
      
      const title = (titleInput?.value || formData.title || editingProject?.title || '').trim();
      const description = (descriptionInput?.value || formData.description || editingProject?.description || '').trim();
      const techStack = (techStackInput?.value || formData.tech_stack || 
        (editingProject?.tech_stack ? 
          (Array.isArray(editingProject.tech_stack) ? editingProject.tech_stack.join(', ') : String(editingProject.tech_stack))
          : '')).trim();
      
      const demoLink = (demoLinkInput?.value ?? formData.demo_link ?? editingProject?.demo_link ?? '').trim();
      const repoLink = (repoLinkInput?.value ?? formData.repo_link ?? editingProject?.repo_link ?? '').trim();

      const titleValid = title && title.length > 0;
      const descriptionValid = description && description.length > 0;
      const techStackValid = techStack && techStack.length > 0;

      if (!titleValid || !descriptionValid || !techStackValid) {
        const missingFields = [];
        if (!titleValid) missingFields.push('Title');
        if (!descriptionValid) missingFields.push('Description');
        if (!techStackValid) missingFields.push('Tech Stack');
        alert(`Please fill in all required fields:\n${missingFields.join('\n')}`);
        return;
      }

      const formDataToSend = new FormData();
      
      formDataToSend.append('title', title);
      formDataToSend.append('description', description);
      formDataToSend.append('tech_stack', techStack);
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      } else if (removeImage && editingProject) {
        formDataToSend.append('image_url', '');
      } else if (formData.image_url && !editingProject) {
        formDataToSend.append('image_url', formData.image_url.trim());
      }
      
      formDataToSend.append('demo_link', demoLink || '');
      formDataToSend.append('repo_link', repoLink || '');

      if (editingProject) {
        formDataToSend.append('_method', 'PUT');
        await api.post(`/projects/${editingProject.id}`, formDataToSend);
      } else {
        await api.post('/projects', formDataToSend);
      }

      setShowModal(false);
      setEditingProject(null);
      resetForm();
      fetchProjects();
    } catch (error: any) {
      console.error('Error saving project:', error);
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Error saving project. Please try again.';
      
      if (error.response?.data?.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat().join(', ');
        alert(`Validation errors: ${validationErrors}`);
      } else {
        alert(errorMessage);
      }
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : (project.tech_stack || ''),
      image_url: project.image_url || '',
      demo_link: project.demo_link || '',
      repo_link: project.repo_link || '',
    });
    setImagePreview(project.image_url || null);
    setImageFile(null);
    setRemoveImage(false);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project? This will also delete the associated image file.')) return;

    try {
      await api.delete(`/projects/${id}`);
      await fetchProjects();
      alert('Project deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting project:', error);
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Error deleting project. Please try again.';
      alert(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      tech_stack: '',
      image_url: '',
      demo_link: '',
      repo_link: '',
    });
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        e.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB.');
        e.target.value = '';
        return;
      }
      setImageFile(file);
      setRemoveImage(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setEditingProject(null);
    resetForm();
    setShowModal(true);
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage your portfolio projects</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium hover:scale-105"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Project
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-soft">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first project</p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300 border border-gray-100 group"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-md"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-md"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                
                {/* Tech Stack */}
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Array.isArray(project.tech_stack) ? (
                      project.tech_stack.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                        >
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                        {project.tech_stack}
                      </span>
                    )}
                    {Array.isArray(project.tech_stack) && project.tech_stack.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        +{project.tech_stack.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Links */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  {project.demo_link && (
                    <a
                      href={project.demo_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Demo
                    </a>
                  )}
                  {project.repo_link && (
                    <a
                      href={project.repo_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-gray-600 hover:text-gray-700 font-medium"
                    >
                      <Github className="w-4 h-4 mr-1" />
                      Repo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingProject(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter project title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows={4}
                  placeholder="Describe your project"
                />
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tech Stack (comma separated) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="tech_stack"
                  required
                  value={formData.tech_stack}
                  onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="React, Laravel, TypeScript"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600 font-medium">
                      {imageFile ? 'Change image' : 'Click to upload or drag and drop'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</span>
                  </label>
                </div>
                {(imagePreview || (editingProject?.image_url && !removeImage)) && (
                  <div className="mt-4 relative group">
                    <img
                      src={imagePreview || editingProject?.image_url || ''}
                      alt={imageFile ? "Preview" : "Current"}
                      className="w-full h-48 object-cover rounded-xl border border-gray-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (imageFile) {
                          setImageFile(null);
                          setImagePreview(editingProject?.image_url || null);
                        } else if (editingProject?.image_url) {
                          setRemoveImage(true);
                          setImagePreview(null);
                        }
                      }}
                      className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 shadow-lg transition-colors"
                      title="Delete image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {removeImage && (
                      <div className="mt-2 text-sm text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-200">
                        Image will be removed when you save
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Demo Link */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Demo Link
                </label>
                <input
                  type="url"
                  name="demo_link"
                  value={formData.demo_link}
                  onChange={(e) => setFormData({ ...formData, demo_link: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://example.com"
                />
              </div>

              {/* Repo Link */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Repository Link
                </label>
                <input
                  type="url"
                  name="repo_link"
                  value={formData.repo_link}
                  onChange={(e) => setFormData({ ...formData, repo_link: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://github.com/username/repo"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProject(null);
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
                  {editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
