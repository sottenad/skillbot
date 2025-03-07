'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Skill {
  id: string;
  name: string;
  category?: string | null;
  description?: string | null;
}

interface UserSkill {
  id: string;
  skillId: string;
  level: number;
  skill: Skill;
}

export default function SkillsManager() {
  const { data: session } = useSession();
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [skillLevel, setSkillLevel] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch user skills
        const userResponse = await fetch('/api/user/profile');
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user profile');
        }
        const userData = await userResponse.json();
        setUserSkills(userData.userSkills || []);

        // Fetch all available skills
        const skillsResponse = await fetch('/api/skills');
        if (!skillsResponse.ok) {
          throw new Error('Failed to fetch skills');
        }
        const skillsData = await skillsResponse.json();
        setAvailableSkills(skillsData);
      } catch (error) {
        setMessage({
          text: error instanceof Error ? error.message : 'Failed to load data',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  const handleAddSkill = async () => {
    if (!selectedSkill) return;

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('/api/user/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skillId: selectedSkill,
          level: skillLevel,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add skill');
      }

      const data = await response.json();
      
      // Update the local state with the new skill
      setUserSkills((prev) => [...prev, data.userSkill]);
      setSelectedSkill('');
      setSkillLevel(3);
      setMessage({ text: 'Skill added successfully', type: 'success' });
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : 'Failed to add skill',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSkill = async (userSkillId: string) => {
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch(`/api/user/skills/${userSkillId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to remove skill');
      }

      // Update the local state by removing the deleted skill
      setUserSkills((prev) => prev.filter((skill) => skill.id !== userSkillId));
      setMessage({ text: 'Skill removed successfully', type: 'success' });
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : 'Failed to remove skill',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSkillLevel = async (userSkillId: string, newLevel: number) => {
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch(`/api/user/skills/${userSkillId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level: newLevel,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update skill level');
      }

      // Update the local state with the new skill level
      setUserSkills((prev) =>
        prev.map((skill) =>
          skill.id === userSkillId ? { ...skill, level: newLevel } : skill
        )
      );
      setMessage({ text: 'Skill level updated successfully', type: 'success' });
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : 'Failed to update skill level',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter out skills that the user already has
  const filteredAvailableSkills = availableSkills.filter(
    (skill) => !userSkills.some((userSkill) => userSkill.skillId === skill.id)
  );

  // Filter skills based on search term
  const searchFilteredSkills = filteredAvailableSkills.filter((skill) =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (skill.category && skill.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Group user skills by category
  const groupedUserSkills = userSkills.reduce((acc, userSkill) => {
    const category = userSkill.skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(userSkill);
    return acc;
  }, {} as Record<string, UserSkill[]>);

  if (isLoading && !userSkills.length) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Manage Your Skills</h3>
      
      {message.text && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mb-8">
        <h4 className="text-md font-medium text-gray-700 mb-2">Add a New Skill</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="col-span-2">
            <label htmlFor="skill-search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Skills
            </label>
            <input
              type="text"
              id="skill-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by skill name or category"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="col-span-2">
            <label htmlFor="skill" className="block text-sm font-medium text-gray-700 mb-1">
              Select Skill
            </label>
            <select
              id="skill"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select a skill</option>
              {searchFilteredSkills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name} {skill.category ? `(${skill.category})` : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
              Proficiency Level (1-5)
            </label>
            <select
              id="level"
              value={skillLevel}
              onChange={(e) => setSkillLevel(Number(e.target.value))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="1">1 - Beginner</option>
              <option value="2">2 - Basic</option>
              <option value="3">3 - Intermediate</option>
              <option value="4">4 - Advanced</option>
              <option value="5">5 - Expert</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <button
            onClick={handleAddSkill}
            disabled={!selectedSkill || isLoading}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
          >
            {isLoading ? 'Adding...' : 'Add Skill'}
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-700 mb-4">Your Skills</h4>
        
        {Object.keys(groupedUserSkills).length === 0 ? (
          <p className="text-gray-500 italic">You haven't added any skills yet.</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedUserSkills).map(([category, skills]) => (
              <div key={category}>
                <h5 className="text-sm font-medium text-gray-900 mb-2">{category}</h5>
                <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
                  {skills.map((userSkill) => (
                    <li key={userSkill.id} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{userSkill.skill.name}</p>
                        <p className="text-xs text-gray-500">{userSkill.skill.description}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div>
                          <label htmlFor={`level-${userSkill.id}`} className="sr-only">
                            Skill Level
                          </label>
                          <select
                            id={`level-${userSkill.id}`}
                            value={userSkill.level}
                            onChange={(e) => handleUpdateSkillLevel(userSkill.id, Number(e.target.value))}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs"
                          >
                            <option value="1">1 - Beginner</option>
                            <option value="2">2 - Basic</option>
                            <option value="3">3 - Intermediate</option>
                            <option value="4">4 - Advanced</option>
                            <option value="5">5 - Expert</option>
                          </select>
                        </div>
                        <button
                          onClick={() => handleRemoveSkill(userSkill.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 