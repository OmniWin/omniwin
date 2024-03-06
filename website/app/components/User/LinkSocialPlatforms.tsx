// LinkSocialPlatforms.tsx
import React from 'react';
import { Input } from '@/components/ui/input'; // Adjust the import path as necessary
import { Button } from '@/components/ui/button'; // Adjust the import path as necessary

const platforms = [
  { id: 'twitter', label: 'Twitter', placeholder: '@username' },
  { id: 'discord', label: 'Discord', placeholder: 'User#1234' },
  { id: 'telegram', label: 'Telegram', placeholder: '@username' },
  { id: 'email', label: 'Email', placeholder: 'example@example.com' },
];

const LinkSocialPlatforms: React.FC = () => {
  const handleSync = (platformId: string) => {
    // Placeholder for actual sync logic
    console.log(`Syncing ${platformId}`);
    alert(`Sync requested for ${platformId}. Replace this alert with actual sync logic.`);
  };

  return (
    <div className="space-y-4">
      {platforms.map((platform) => (
        <div key={platform.id} className="flex items-center space-x-2">
          <Input
            aria-label={platform.label}
            placeholder={platform.placeholder}
            className="flex-1"
            disabled
          />
          <Button onClick={() => handleSync(platform.id)} variant="primary">
            Sync
          </Button>
        </div>
      ))}
    </div>
  );
};

export default LinkSocialPlatforms;
