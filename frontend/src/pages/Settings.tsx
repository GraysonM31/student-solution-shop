import {
  Box,
  VStack,
  Text,
  FormControl,
  FormLabel,
  Switch,
  Input,
  Button,
  useToast,
  Divider,
} from '@chakra-ui/react';
import { useState } from 'react';

interface UserSettings {
  emailNotifications: boolean;
  dailyReminders: boolean;
  weeklyReports: boolean;
  monthlyBudget: string;
}

const Settings = () => {
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    dailyReminders: true,
    weeklyReports: false,
    monthlyBudget: '1000',
  });

  const toast = useToast();

  const handleSaveSettings = () => {
    // Here you would typically save to backend/database
    toast({
      title: 'Settings saved',
      description: 'Your preferences have been updated successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb="6">
        Settings
      </Text>

      <Box bg="dark.200" p="6" borderRadius="xl" maxW="600px">
        <VStack spacing="6" align="stretch">
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="email-notifications" mb="0">
              Email Notifications
            </FormLabel>
            <Switch
              id="email-notifications"
              isChecked={settings.emailNotifications}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  emailNotifications: e.target.checked,
                })
              }
              colorScheme="green"
            />
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="daily-reminders" mb="0">
              Daily Task Reminders
            </FormLabel>
            <Switch
              id="daily-reminders"
              isChecked={settings.dailyReminders}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  dailyReminders: e.target.checked,
                })
              }
              colorScheme="green"
            />
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="weekly-reports" mb="0">
              Weekly Progress Reports
            </FormLabel>
            <Switch
              id="weekly-reports"
              isChecked={settings.weeklyReports}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  weeklyReports: e.target.checked,
                })
              }
              colorScheme="green"
            />
          </FormControl>

          <Divider />

          <FormControl>
            <FormLabel htmlFor="monthly-budget">Monthly Budget</FormLabel>
            <Input
              id="monthly-budget"
              type="number"
              value={settings.monthlyBudget}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  monthlyBudget: e.target.value,
                })
              }
              bg="dark.300"
            />
          </FormControl>

          <Button colorScheme="green" onClick={handleSaveSettings}>
            Save Settings
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default Settings; 