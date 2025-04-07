import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Save } from "lucide-react";

interface ConfigPanelProps {
  onSave?: (config: any) => void;
  initialConfig?: any;
}

const ConfigPanel = ({
  onSave = () => {},
  initialConfig = {},
}: ConfigPanelProps) => {
  const [activeTab, setActiveTab] = useState("credentials");
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    null | "success" | "error"
  >(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveStatus, setSaveStatus] = useState<null | "success" | "error">(
    null,
  );

  // Default values for form fields
  const [credentials, setCredentials] = useState({
    jueri: {
      username: initialConfig?.jueri?.username || "",
      password: initialConfig?.jueri?.password || "",
    },
    lojaIntegrada: {
      chave_api: initialConfig?.lojaIntegrada?.chave_api || "",
      chave_aplicacao: initialConfig?.lojaIntegrada?.chave_aplicacao || "",
    },
    woocommerce: {
      url_base: initialConfig?.woocommerce?.url_base || "",
      consumer_key: initialConfig?.woocommerce?.consumer_key || "",
      consumer_secret: initialConfig?.woocommerce?.consumer_secret || "",
    },
  });

  const [syncSettings, setSyncSettings] = useState({
    frequency: initialConfig?.syncSettings?.frequency || "daily",
    fields: {
      inventory: initialConfig?.syncSettings?.fields?.inventory || true,
      pricing: initialConfig?.syncSettings?.fields?.pricing || true,
      descriptions: initialConfig?.syncSettings?.fields?.descriptions || false,
    },
    notifications: {
      email: initialConfig?.syncSettings?.notifications?.email || false,
      emailAddress:
        initialConfig?.syncSettings?.notifications?.emailAddress || "",
      errorThreshold:
        initialConfig?.syncSettings?.notifications?.errorThreshold || "10",
    },
  });

  const handleCredentialsChange = (
    platform: "jueri" | "lojaIntegrada" | "woocommerce",
    field: string,
    value: string,
  ) => {
    setCredentials((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value,
      },
    }));
  };

  const handleSyncSettingsChange = (
    section: string,
    field: string,
    value: any,
  ) => {
    setSyncSettings((prev) => {
      if (section === "fields" || section === "notifications") {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value,
          },
        };
      } else {
        return {
          ...prev,
          [field]: value,
        };
      }
    });
  };

  const testConnection = async (
    platform: "jueri" | "lojaIntegrada" | "woocommerce",
  ) => {
    setTestingConnection(true);
    setConnectionStatus(null);

    // Simulate API connection test
    setTimeout(() => {
      // In a real app, this would be an actual API call
      const success = Math.random() > 0.3; // 70% chance of success for demo
      setConnectionStatus(success ? "success" : "error");
      setTestingConnection(false);
    }, 1500);
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    setSaveStatus(null);

    // Simulate saving settings
    setTimeout(() => {
      // In a real app, this would be an actual API call
      const success = Math.random() > 0.2; // 80% chance of success for demo
      setSaveStatus(success ? "success" : "error");
      setSavingSettings(false);

      if (success) {
        onSave({
          ...credentials,
          syncSettings,
        });
      }
    }, 1000);
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle>Configuration Panel</CardTitle>
        <CardDescription>
          Manage API credentials and synchronization settings for your
          e-commerce platforms.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="credentials"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="credentials">API Credentials</TabsTrigger>
            <TabsTrigger value="settings">Sync Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="credentials" className="space-y-6 mt-6">
            {/* Jueri ERP Credentials */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Jueri ERP Credentials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jueri-username">Username</Label>
                  <Input
                    id="jueri-username"
                    value={credentials.jueri.username}
                    onChange={(e) =>
                      handleCredentialsChange(
                        "jueri",
                        "username",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jueri-password">Password</Label>
                  <Input
                    id="jueri-password"
                    type="password"
                    value={credentials.jueri.password}
                    onChange={(e) =>
                      handleCredentialsChange(
                        "jueri",
                        "password",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => testConnection("jueri")}
                disabled={testingConnection}
              >
                {testingConnection ? "Testing..." : "Test Connection"}
              </Button>

              {connectionStatus === "success" && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Connection to Jueri ERP was successful.
                  </AlertDescription>
                </Alert>
              )}

              {connectionStatus === "error" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Failed to connect to Jueri ERP. Please check your
                    credentials.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Loja Integrada Credentials */}
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-medium">
                Loja Integrada Credentials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loja-api-key">API Key</Label>
                  <Input
                    id="loja-api-key"
                    value={credentials.lojaIntegrada.chave_api}
                    onChange={(e) =>
                      handleCredentialsChange(
                        "lojaIntegrada",
                        "chave_api",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loja-app-key">Application Key</Label>
                  <Input
                    id="loja-app-key"
                    value={credentials.lojaIntegrada.chave_aplicacao}
                    onChange={(e) =>
                      handleCredentialsChange(
                        "lojaIntegrada",
                        "chave_aplicacao",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => testConnection("lojaIntegrada")}
                disabled={testingConnection}
              >
                {testingConnection ? "Testing..." : "Test Connection"}
              </Button>
            </div>

            {/* WooCommerce Credentials */}
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-medium">WooCommerce Credentials</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="woo-url">Site URL</Label>
                  <Input
                    id="woo-url"
                    placeholder="https://yourstore.com"
                    value={credentials.woocommerce.url_base}
                    onChange={(e) =>
                      handleCredentialsChange(
                        "woocommerce",
                        "url_base",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="woo-consumer-key">Consumer Key</Label>
                    <Input
                      id="woo-consumer-key"
                      value={credentials.woocommerce.consumer_key}
                      onChange={(e) =>
                        handleCredentialsChange(
                          "woocommerce",
                          "consumer_key",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="woo-consumer-secret">Consumer Secret</Label>
                    <Input
                      id="woo-consumer-secret"
                      type="password"
                      value={credentials.woocommerce.consumer_secret}
                      onChange={(e) =>
                        handleCredentialsChange(
                          "woocommerce",
                          "consumer_secret",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => testConnection("woocommerce")}
                  disabled={testingConnection}
                >
                  {testingConnection ? "Testing..." : "Test Connection"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            {/* Sync Frequency */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Synchronization Frequency</h3>
              <div className="space-y-2">
                <Label htmlFor="sync-frequency">
                  How often should data be synchronized?
                </Label>
                <Select
                  value={syncSettings.frequency}
                  onValueChange={(value) =>
                    handleSyncSettingsChange("", "frequency", value)
                  }
                >
                  <SelectTrigger id="sync-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="manual">Manual Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Fields to Sync */}
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-medium">Fields to Synchronize</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sync-inventory"
                    checked={syncSettings.fields.inventory}
                    onCheckedChange={(checked) =>
                      handleSyncSettingsChange(
                        "fields",
                        "inventory",
                        checked === true,
                      )
                    }
                  />
                  <Label htmlFor="sync-inventory">Inventory Quantities</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sync-pricing"
                    checked={syncSettings.fields.pricing}
                    onCheckedChange={(checked) =>
                      handleSyncSettingsChange(
                        "fields",
                        "pricing",
                        checked === true,
                      )
                    }
                  />
                  <Label htmlFor="sync-pricing">Product Pricing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sync-descriptions"
                    checked={syncSettings.fields.descriptions}
                    onCheckedChange={(checked) =>
                      handleSyncSettingsChange(
                        "fields",
                        "descriptions",
                        checked === true,
                      )
                    }
                  />
                  <Label htmlFor="sync-descriptions">
                    Product Descriptions
                  </Label>
                </div>
              </div>
            </div>

            {/* Error Notifications */}
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-medium">Error Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="email-notifications"
                    checked={syncSettings.notifications.email}
                    onCheckedChange={(checked) =>
                      handleSyncSettingsChange(
                        "notifications",
                        "email",
                        checked,
                      )
                    }
                  />
                  <Label htmlFor="email-notifications">
                    Email Notifications
                  </Label>
                </div>

                {syncSettings.notifications.email && (
                  <div className="space-y-4 pl-6">
                    <div className="space-y-2">
                      <Label htmlFor="email-address">Email Address</Label>
                      <Input
                        id="email-address"
                        type="email"
                        placeholder="your@email.com"
                        value={syncSettings.notifications.emailAddress}
                        onChange={(e) =>
                          handleSyncSettingsChange(
                            "notifications",
                            "emailAddress",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="error-threshold">Error Threshold</Label>
                      <Select
                        value={syncSettings.notifications.errorThreshold}
                        onValueChange={(value) =>
                          handleSyncSettingsChange(
                            "notifications",
                            "errorThreshold",
                            value,
                          )
                        }
                      >
                        <SelectTrigger id="error-threshold">
                          <SelectValue placeholder="Select threshold" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Any error (1+)</SelectItem>
                          <SelectItem value="5">5+ errors</SelectItem>
                          <SelectItem value="10">10+ errors</SelectItem>
                          <SelectItem value="25">25+ errors</SelectItem>
                          <SelectItem value="50">50+ errors</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-6">
        <Button
          variant="outline"
          onClick={() =>
            setActiveTab(
              activeTab === "credentials" ? "settings" : "credentials",
            )
          }
        >
          {activeTab === "credentials"
            ? "Next: Sync Settings"
            : "Back to Credentials"}
        </Button>
        <Button onClick={saveSettings} disabled={savingSettings}>
          <Save className="mr-2 h-4 w-4" />
          {savingSettings ? "Saving..." : "Save Configuration"}
        </Button>
      </CardFooter>

      {saveStatus === "success" && (
        <div className="px-6 pb-6">
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Configuration saved successfully.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {saveStatus === "error" && (
        <div className="px-6 pb-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to save configuration. Please try again.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </Card>
  );
};

export default ConfigPanel;
