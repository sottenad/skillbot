'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Skill {
  id: string;
  name: string;
  category?: string | null;
  description?: string | null;
}

interface Role {
  id: string;
  name: string;
  description?: string | null;
  skills: {
    skill: Skill;
    importance: number;
  }[];
}

export default function SkillsPage() {
  const { data: session } = useSession();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('skills');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch skills
        const skillsResponse = await fetch('/api/skills');
        if (!skillsResponse.ok) {
          throw new Error('Failed to fetch skills');
        }
        const skillsData = await skillsResponse.json();
        setSkills(skillsData);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(skillsData.map((skill: Skill) => skill.category || 'Uncategorized'))
        ) as string[];
        setCategories(['all', ...uniqueCategories]);

        // Fetch roles
        const rolesResponse = await fetch('/api/roles');
        if (!rolesResponse.ok) {
          throw new Error('Failed to fetch roles');
        }
        const rolesData = await rolesResponse.json();
        setRoles(rolesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter skills based on search term and category
  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (skill.description && skill.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || 
      (skill.category || 'Uncategorized') === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filter roles based on search term
  const filteredRoles = roles.filter((role) => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get the selected role details
  const selectedRoleData = selectedRole 
    ? roles.find(role => role.id === selectedRole) 
    : null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Skills Library
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Browse all available skills and role templates
          </p>
        </div>
        {session && (
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <Link
              href="/profile"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Manage Your Skills
            </Link>
          </div>
        )}
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('skills')}
            className={`${
              activeTab === 'skills'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            All Skills
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`${
              activeTab === 'roles'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Role Templates
          </button>
        </nav>
      </div>

      <div className="mt-8">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${activeTab === 'skills' ? 'skills' : 'roles'}...`}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            {activeTab === 'skills' && (
              <div className="sm:w-64">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Category
                </label>
                <select
                  id="category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {activeTab === 'skills' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSkills.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No skills found matching your criteria.</p>
              </div>
            ) : (
              filteredSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">{skill.name}</h3>
                    <div className="mt-1 max-w-2xl text-sm text-gray-500">
                      <p className="text-xs font-medium text-indigo-600">{skill.category || 'Uncategorized'}</p>
                    </div>
                    <div className="mt-3 text-sm text-gray-500">
                      <p>{skill.description || 'No description available.'}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : selectedRoleData ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setSelectedRole(null)}
                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
              >
                ← Back to all roles
              </button>
            </div>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedRoleData.name}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {selectedRoleData.description || 'No description available.'}
                </p>
              </div>
              <div className="border-t border-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Required Skills</h4>
                  <div className="space-y-4">
                    {selectedRoleData.skills.length === 0 ? (
                      <p className="text-gray-500">No skills defined for this role.</p>
                    ) : (
                      selectedRoleData.skills
                        .sort((a, b) => b.importance - a.importance)
                        .map(({ skill, importance }) => (
                          <div key={skill.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="text-sm font-medium text-gray-900">{skill.name}</h5>
                                <p className="text-xs text-gray-500 mt-1">{skill.category}</p>
                                <p className="text-sm text-gray-600 mt-2">{skill.description}</p>
                              </div>
                              <div className="ml-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  importance >= 4 
                                    ? 'bg-red-100 text-red-800' 
                                    : importance >= 3 
                                      ? 'bg-yellow-100 text-yellow-800' 
                                      : 'bg-green-100 text-green-800'
                                }`}>
                                  {importance >= 4 
                                    ? 'Essential' 
                                    : importance >= 3 
                                      ? 'Important' 
                                      : 'Helpful'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRoles.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No roles found matching your criteria.</p>
              </div>
            ) : (
              filteredRoles.map((role) => (
                <div
                  key={role.id}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md cursor-pointer"
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">{role.name}</h3>
                    <div className="mt-3 text-sm text-gray-500">
                      <p>{role.description || 'No description available.'}</p>
                    </div>
                    <div className="mt-4">
                      <span className="text-xs text-gray-500">
                        {role.skills.length} skills required
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
} 