/**
 * @file page.tsx
 * @description Authentication page component for BizLevel application
 * @dependencies None
 */

export default function AuthPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Authentication</h1>
          <p className="mt-2 text-gray-600">Sign in to access your BizLevel account</p>
        </div>
        <div className="mt-8 space-y-6">
          <p className="text-center text-gray-500">Authentication functionality will be implemented here</p>
        </div>
      </div>
    </div>
  );
} 