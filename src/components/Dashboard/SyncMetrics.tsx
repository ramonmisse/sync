import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Clock, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

interface SyncMetricsProps {
  successCount?: number;
  failureCount?: number;
  lojaIntegradaCount?: number;
  wooCommerceCount?: number;
  lastSyncTime?: string;
  syncStatus?: "idle" | "syncing" | "success" | "error";
  syncProgress?: number;
}

const SyncMetrics = ({
  successCount = 124,
  failureCount = 7,
  lojaIntegradaCount = 78,
  wooCommerceCount = 53,
  lastSyncTime = "2023-07-15 14:32:45",
  syncStatus = "idle",
  syncProgress = 100,
}: SyncMetricsProps) => {
  const totalCount = successCount + failureCount;
  const successRate =
    totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;

  const getStatusBadge = () => {
    switch (syncStatus) {
      case "syncing":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <RefreshCw className="mr-1 h-3 w-3 animate-spin" /> Syncing
          </Badge>
        );
      case "success":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="mr-1 h-3 w-3" /> Completed
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive">
            <AlertCircle className="mr-1 h-3 w-3" /> Error
          </Badge>
        );
      default:
        return <Badge variant="outline">Idle</Badge>;
    }
  };

  return (
    <div className="w-full bg-background">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Successful Updates
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successCount}</div>
            <p className="text-xs text-muted-foreground">
              {successRate}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Failed Updates
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failureCount}</div>
            <p className="text-xs text-muted-foreground">
              {totalCount > 0
                ? Math.round((failureCount / totalCount) * 100)
                : 0}
              % failure rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Platform Updates
            </CardTitle>
            <div className="flex space-x-1">
              <Badge variant="outline" className="text-xs">
                Loja
              </Badge>
              <Badge variant="outline" className="text-xs">
                WooCommerce
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{lojaIntegradaCount}</div>
                <p className="text-xs text-muted-foreground">Loja Integrada</p>
              </div>
              <Separator orientation="vertical" className="h-10 mx-2" />
              <div>
                <div className="text-2xl font-bold">{wooCommerceCount}</div>
                <p className="text-xs text-muted-foreground">WooCommerce</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sync Status</CardTitle>
            {getStatusBadge()}
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Last sync: {lastSyncTime}</span>
              </div>
              {syncStatus === "syncing" && (
                <div className="w-full">
                  <Progress value={syncProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {syncProgress}% complete
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SyncMetrics;
