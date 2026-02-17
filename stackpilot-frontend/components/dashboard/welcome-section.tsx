interface WelcomeSectionProps {
  userName?: string;
  userEmail?: string;
}

export function WelcomeSection({ userName, userEmail }: WelcomeSectionProps) {
  const displayName = userName || userEmail?.split("@")[0];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome back, {displayName}! 👋
      </h1>
      <p className="text-gray-600 mt-2">
        Here&apos;s what&apos;s happening with your job search today.
      </p>
    </div>
  );
}
