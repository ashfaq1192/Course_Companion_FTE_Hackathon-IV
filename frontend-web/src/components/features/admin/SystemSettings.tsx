import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { Label } from '@/components/ui/Label';

interface SystemSettings {
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailNotifications: boolean;
  aiFeaturesEnabled: boolean;
  maxFileSize: number; // in MB
  allowedFileTypes: string[];
  sessionTimeout: number; // in minutes
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  privacyPolicyUrl: string;
  termsOfServiceUrl: string;
}

export const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    aiFeaturesEnabled: true,
    maxFileSize: 10,
    allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png'],
    sessionTimeout: 60,
    backupFrequency: 'daily',
    privacyPolicyUrl: '',
    termsOfServiceUrl: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Simulate loading settings from an API
  useEffect(() => {
    // In a real app, this would fetch settings from the backend
    console.log('Loading system settings...');
  }, []);

  const handleChange = (field: keyof SystemSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // In a real app, this would send settings to the backend
      console.log('Saving system settings:', settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveMessage('Settings saved successfully!');
    } catch (error) {
      setSaveMessage('Error saving settings. Please try again.');
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Maintenance Mode */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Maintenance Mode</h3>
                <p className="text-sm text-gray-500">
                  Enable to temporarily disable user access for maintenance
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleChange('maintenanceMode', checked)}
              />
            </div>

            {/* Registration Enabled */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">User Registration</h3>
                <p className="text-sm text-gray-500">
                  Allow new users to register for accounts
                </p>
              </div>
              <Switch
                checked={settings.registrationEnabled}
                onCheckedChange={(checked) => handleChange('registrationEnabled', checked)}
              />
            </div>

            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-500">
                  Send email notifications to users
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleChange('emailNotifications', checked)}
              />
            </div>

            {/* AI Features */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">AI Features</h3>
                <p className="text-sm text-gray-500">
                  Enable AI-powered features (adaptive learning, LLM grading)
                </p>
              </div>
              <Switch
                checked={settings.aiFeaturesEnabled}
                onCheckedChange={(checked) => handleChange('aiFeaturesEnabled', checked)}
              />
            </div>

            {/* Max File Size */}
            <div>
              <Label htmlFor="maxFileSize">Maximum File Upload Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => handleChange('maxFileSize', parseInt(e.target.value))}
                className="mt-1"
              />
            </div>

            {/* Session Timeout */}
            <div>
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                className="mt-1"
              />
            </div>

            {/* Backup Frequency */}
            <div>
              <Label>Backup Frequency</Label>
              <div className="flex space-x-4 mt-2">
                {(['daily', 'weekly', 'monthly'] as const).map(freq => (
                  <label key={freq} className="flex items-center">
                    <input
                      type="radio"
                      name="backupFrequency"
                      checked={settings.backupFrequency === freq}
                      onChange={() => handleChange('backupFrequency', freq)}
                      className="mr-2"
                    />
                    <span className="capitalize">{freq}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Privacy Policy URL */}
            <div>
              <Label htmlFor="privacyPolicyUrl">Privacy Policy URL</Label>
              <Input
                id="privacyPolicyUrl"
                type="url"
                value={settings.privacyPolicyUrl}
                onChange={(e) => handleChange('privacyPolicyUrl', e.target.value)}
                placeholder="https://example.com/privacy"
                className="mt-1"
              />
            </div>

            {/* Terms of Service URL */}
            <div>
              <Label htmlFor="termsOfServiceUrl">Terms of Service URL</Label>
              <Input
                id="termsOfServiceUrl"
                type="url"
                value={settings.termsOfServiceUrl}
                onChange={(e) => handleChange('termsOfServiceUrl', e.target.value)}
                placeholder="https://example.com/terms"
                className="mt-1"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>

            {/* Message */}
            {saveMessage && (
              <div className={`p-4 rounded ${
                saveMessage.includes('Error') 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {saveMessage}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};