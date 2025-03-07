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

interface SuggestedSkill {
  id: string;
  name: string;
  category?: string | null;
  description?: string | null;
  reason: string;
}

export default function SkillSuggestions() {
  const { data: session } = useSession();
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [suggestedSkills, setSuggestedSkills] = useState<SuggestedSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchUserSkills = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/user/profile');
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        const userData = await response.json();
        setUserSkills(userData.userSkills || []);
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
      fetchUserSkills();
    }
  }, [session]);

  const generateSuggestions = async () => {
    setIsGenerating(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('/api/ai/skill-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userSkills: userSkills.map((us) => ({
            name: us.skill.name,
            category: us.skill.category,
            level: us.level,
          })),
          role: session?.user?.role || '',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to generate suggestions');
      }

      const data = await response.json();
      setSuggestedSkills(data.suggestions);
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : 'Failed to generate suggestions',
        type: 'error',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const addSkillToProfile = async (skillId: string) => {
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('/api/user/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skillId,
          level: 1, // Default to beginner level for suggested skills
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add skill');
      }

      const data = await response.json();
      
      // Update the local state with the new skill
      setUserSkills((prev) => [...prev, data.userSkill]);
      
      // Remove the skill from suggestions
      setSuggestedSkills((prev) => prev.filter((skill) => skill.id !== skillId));
      
      setMessage({ text: 'Skill added to your profile', type: 'success' });
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : 'Failed to add skill',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !userSkills.length) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">AI Skill Suggestions</h3>
        <button
          onClick={generateSuggestions}
          disabled={isGenerating || userSkills.length === 0}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate Suggestions'
          )}
        </button>
      </div>
      
      {message.text && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {userSkills.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Add some skills to your profile first to get suggestions.</p>
        </div>
      ) : suggestedSkills.length === 0 && !isGenerating ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Click the "Generate Suggestions" button to get AI-powered skill recommendations based on your profile.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {isGenerating ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Analyzing your skills and generating suggestions...</p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500">
                Based on your current skills and role, we recommend adding these skills to your profile:
              </p>
              <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
                {suggestedSkills.map((skill) => (
                  <li key={skill.id} className="py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{skill.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{skill.category}</p>
                        <p className="text-sm text-gray-600 mt-2">{skill.reason}</p>
                      </div>
                      <button
                        onClick={() => addSkillToProfile(skill.id)}
                        disabled={isLoading}
                        className="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                      >
                        Add to Profile
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}