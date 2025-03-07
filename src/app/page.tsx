import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)]">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Manage Your Skills with SkillBot
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Track, manage, and discover skills for tech consulting professionals. 
          Our AI-powered platform helps you identify skill gaps and suggests new skills based on your profile.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/auth/signin"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Get started
          </Link>
          <Link href="/skills" className="text-sm font-semibold leading-6 text-gray-900">
            Learn more <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Track Your Skills</h2>
          <p className="text-gray-600">
            Maintain a comprehensive profile of your technical and professional skills, 
            with proficiency levels and experience details.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Skill Suggestions</h2>
          <p className="text-gray-600">
            Our AI analyzes your skill profile and suggests complementary skills 
            that might be missing from your profile based on industry patterns.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Role Templates</h2>
          <p className="text-gray-600">
            Explore skill templates for common tech consulting roles to benchmark 
            your skills against industry standards.
          </p>
        </div>
      </div>
    </div>
  );
}
