import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
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

  useEffect(() => {
    fetchProjects();
  }, []);

  // Ensure formData is populated when editingProject changes
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
    }
  }, [editingProject?.id, showModal]); // Only depend on the ID, not the whole object

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // When editing, always prioritize editingProject values, then formData
      // When creating, use formData
      const title = editingProject 
        ? (formData.title || editingProject.title || '').trim()
        : (formData.title || '').trim();
      
      const description = editingProject
        ? (formData.description || editingProject.description || '').trim()
        : (formData.description || '').trim();
      
      const techStack = editingProject
        ? (formData.tech_stack || (Array.isArray(editingProject.tech_stack) 
            ? editingProject.tech_stack.join(', ') 
            : editingProject.tech_stack || '')).trim()
        : (formData.tech_stack || '').trim();

      // Validate required fields
      if (!title || !description || !techStack) {
        console.error('Missing required fields:', { title, description, techStack, formData, editingProject });
        alert(`Please fill in all required fields.\nTitle: ${title ? '✓' : '✗'}\nDescription: ${description ? '✓' : '✗'}\nTech Stack: ${techStack ? '✓' : '✗'}`);
        return;
      }

      // Final validation - ensure values are not empty
      if (!title || title.length === 0) {
        alert('Title cannot be empty. Please check the form.');
        return;
      }
      if (!description || description.length === 0) {
        alert('Description cannot be empty. Please check the form.');
        return;
      }
      if (!techStack || techStack.length === 0) {
        alert('Tech Stack cannot be empty. Please check the form.');
        return;
      }

      // Prepare project data
      const projectData = {
        title,
        description,
        tech_stack: techStack,
        image_url: (formData.image_url || editingProject?.image_url || '').trim() || null,
        demo_link: (formData.demo_link || editingProject?.demo_link || '').trim() || null,
        repo_link: (formData.repo_link || editingProject?.repo_link || '').trim() || null,
      };

      if (editingProject) {
        await api.put(`/projects/${editingProject.id}`, projectData);
      } else {
        await api.post('/projects', projectData);
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
      
      // Show validation errors if present
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
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project. Please try again.');
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
  };


  const openAddModal = () => {
    setEditingProject(null);
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading projects...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <button
          onClick={openAddModal}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Project
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {project.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {project.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(project)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Edit className="w-5 h-5 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingProject ? 'Edit Project' : 'Add Project'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tech_stack}
                    onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="React, Laravel, TypeScript"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Demo Link</label>
                  <input
                    type="url"
                    value={formData.demo_link}
                    onChange={(e) => setFormData({ ...formData, demo_link: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Repo Link</label>
                  <input
                    type="url"
                    value={formData.repo_link}
                    onChange={(e) => setFormData({ ...formData, repo_link: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingProject(null);
                      resetForm();
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingProject ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

