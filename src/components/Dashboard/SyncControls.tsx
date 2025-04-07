import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";

interface SyncControlsProps {
  onSync?: (options: {
    platforms: string[];
    syncType: string;
    productSelection: string;
  }) => void;
  onStopSync?: () => void;
  isSyncing?: boolean;
  syncProgress?: number;
  syncResults?: {
    success: number;
    failed: number;
  };
  timeRemaining?: number;
}

const SyncControls = ({
  onSync = () => {},
  onStopSync = () => {},
  isSyncing = false,
  syncProgress = 0,
  syncResults = { success: 0, failed: 0 },
  timeRemaining = 0,
}: SyncControlsProps) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [syncType, setSyncType] = useState<string>("all");
  const [productSelection, setProductSelection] = useState<string>("all");

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    );
  };

  const handleStartSync = () => {
    if (selectedPlatforms.length === 0) return;

    onSync({
      platforms: selectedPlatforms,
      syncType,
      productSelection,
    });
  };

  return (
    <Card className="w-full bg-white" data-testid="sync-controls">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Manual Sync Controls
        </CardTitle>
        <CardDescription>
          Manually synchronize product data between systems
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Select Platforms</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="loja-integrada"
                checked={selectedPlatforms.includes("loja-integrada")}
                onCheckedChange={() => handlePlatformToggle("loja-integrada")}
              />
              <label
                htmlFor="loja-integrada"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Loja Integrada
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="woocommerce"
                checked={selectedPlatforms.includes("woocommerce")}
                onCheckedChange={() => handlePlatformToggle("woocommerce")}
              />
              <label
                htmlFor="woocommerce"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                WooCommerce
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Sync Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="sync-type" className="text-sm font-medium">
                Data to Sync
              </label>
              <Select value={syncType} onValueChange={setSyncType}>
                <SelectTrigger id="sync-type">
                  <SelectValue placeholder="Select data to sync" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inventory">Inventory Only</SelectItem>
                  <SelectItem value="pricing">Pricing Only</SelectItem>
                  <SelectItem value="all">All Product Data</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="product-selection"
                className="text-sm font-medium"
              >
                Products to Sync
              </label>
              <Select
                value={productSelection}
                onValueChange={setProductSelection}
              >
                <SelectTrigger id="product-selection">
                  <SelectValue placeholder="Select products to sync" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="filtered">Filtered Products</SelectItem>
                  <SelectItem value="selected">Selected Products</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isSyncing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Sync Progress</span>
              <span className="text-sm text-muted-foreground">
                {syncProgress}%
              </span>
            </div>
            <Progress value={syncProgress} className="h-2" />
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Synchronizing data... Please wait.
              </p>
              <p className="text-sm font-medium">
                {timeRemaining > 0 ? `${timeRemaining}s remaining` : ""}
              </p>
            </div>
          </div>
        )}

        {!isSyncing &&
          syncResults &&
          (syncResults.success > 0 || syncResults.failed > 0) && (
            <div className="rounded-md border p-4">
              <h4 className="text-sm font-medium mb-2">Last Sync Results</h4>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                    >
                      {syncResults.success}
                    </Badge>{" "}
                    Successful
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                    >
                      {syncResults.failed}
                    </Badge>{" "}
                    Failed
                  </span>
                </div>
              </div>
            </div>
          )}
      </CardContent>

      <Separator />

      <CardFooter className="pt-4 flex justify-between">
        {!isSyncing ? (
          <Button
            onClick={handleStartSync}
            disabled={selectedPlatforms.length === 0}
            className="w-full sm:w-auto"
          >
            Start Synchronization
          </Button>
        ) : (
          <div className="flex gap-2 w-full">
            <Button
              onClick={onStopSync}
              variant="destructive"
              className="w-full sm:w-auto"
            >
              Stop Synchronization
            </Button>
            <div className="flex-1 flex items-center justify-end">
              <span className="text-sm font-medium flex items-center">
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Syncing in progress...
              </span>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default SyncControls;
