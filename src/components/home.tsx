import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, Settings, RefreshCw } from "lucide-react";
import SyncMetrics from "./Dashboard/SyncMetrics";
import SyncLogs from "./Dashboard/SyncLogs";
import SyncControls from "./Dashboard/SyncControls";
import ConfigPanel from "./Settings/ConfigPanel";
import ProductDataViewer from "./Dashboard/ProductDataViewer";

const Home = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [syncMetrics, setSyncMetrics] = useState({
    successCount: 0,
    failureCount: 0,
    lojaIntegradaCount: 0,
    wooCommerceCount: 0,
    lastSyncTime: "-",
    syncStatus: "idle",
    syncProgress: 0,
    timeRemaining: 0,
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [syncLogs, setSyncLogs] = useState<any[]>([]);
  const [configSaved, setConfigSaved] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowDownUp className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Inventory Sync Manager</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("dashboard")}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Synchronization Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <SyncMetrics
                  successCount={syncMetrics.successCount}
                  failureCount={syncMetrics.failureCount}
                  lojaIntegradaCount={syncMetrics.lojaIntegradaCount}
                  wooCommerceCount={syncMetrics.wooCommerceCount}
                  lastSyncTime={syncMetrics.lastSyncTime}
                  syncStatus={syncMetrics.syncStatus}
                  syncProgress={syncMetrics.syncProgress}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Synchronization Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <SyncControls
                  onSync={({ platforms, syncType, productSelection }) => {
                    // Update sync metrics to show syncing status
                    setSyncMetrics((prev) => ({
                      ...prev,
                      syncStatus: "syncing",
                      syncProgress: 0,
                    }));

                    console.log("Starting sync with:", {
                      platforms,
                      syncType,
                      productSelection,
                    });

                    // Simulate sync process
                    let progress = 0;
                    let timeLeft = 50; // 50 seconds total
                    const syncIntervalRef = { current: null };
                    const countdownIntervalRef = { current: null };

                    // Set up countdown timer
                    countdownIntervalRef.current = setInterval(() => {
                      timeLeft -= 1;
                      if (timeLeft <= 0) {
                        clearInterval(countdownIntervalRef.current);
                      }
                    }, 1000);

                    // Set up progress updater
                    syncIntervalRef.current = setInterval(() => {
                      progress += 2; // 2% per step = 50 steps to reach 100%

                      setSyncMetrics((prev) => ({
                        ...prev,
                        syncProgress: progress,
                        timeRemaining: timeLeft,
                      }));

                      if (progress >= 100) {
                        clearInterval(syncIntervalRef.current);
                        clearInterval(countdownIntervalRef.current);

                        // Simulate some success and failures
                        const success = Math.floor(Math.random() * 20) + 10; // 10-29 successful
                        const failed = Math.floor(Math.random() * 5); // 0-4 failed

                        // Update metrics with new counts
                        setSyncMetrics((prev) => ({
                          ...prev,
                          syncStatus: "success",
                          successCount: prev.successCount + success,
                          failureCount: prev.failureCount + failed,
                          lastSyncTime: new Date()
                            .toISOString()
                            .replace("T", " ")
                            .substring(0, 19),
                          lojaIntegradaCount: platforms.includes(
                            "loja-integrada",
                          )
                            ? prev.lojaIntegradaCount +
                              Math.floor(success * 0.6)
                            : prev.lojaIntegradaCount,
                          wooCommerceCount: platforms.includes("woocommerce")
                            ? prev.wooCommerceCount + Math.floor(success * 0.4)
                            : prev.wooCommerceCount,
                        }));

                        // Generate new sync logs
                        const newLogs = [];
                        const operations = ["inventory", "price", "all"];
                        const operationType =
                          syncType === "all" ? operations : [syncType];

                        // Add success logs
                        for (let i = 0; i < success; i++) {
                          const platformChoice =
                            platforms.length === 1
                              ? platforms[0] === "loja-integrada"
                                ? "Loja Integrada"
                                : "WooCommerce"
                              : Math.random() > 0.5
                                ? "Loja Integrada"
                                : "WooCommerce";

                          newLogs.push({
                            id: `log-${Date.now()}-${i}`,
                            timestamp: new Date(
                              Date.now() - Math.random() * 1000 * 60 * 5,
                            ),
                            operation:
                              operationType[
                                Math.floor(Math.random() * operationType.length)
                              ],
                            productSku: `SKU${Math.floor(Math.random() * 1000)
                              .toString()
                              .padStart(3, "0")}`,
                            productName: `Product ${Math.floor(Math.random() * 1000)}`,
                            platform: platformChoice,
                            status: "success",
                          });
                        }

                        // Add failure logs
                        for (let i = 0; i < failed; i++) {
                          const platformChoice =
                            platforms.length === 1
                              ? platforms[0] === "loja-integrada"
                                ? "Loja Integrada"
                                : "WooCommerce"
                              : Math.random() > 0.5
                                ? "Loja Integrada"
                                : "WooCommerce";

                          const errorMessages = [
                            "API connection timeout",
                            "Invalid price format",
                            "Product not found in target platform",
                            "Insufficient permissions",
                            "Rate limit exceeded",
                          ];

                          newLogs.push({
                            id: `log-${Date.now()}-err-${i}`,
                            timestamp: new Date(
                              Date.now() - Math.random() * 1000 * 60 * 5,
                            ),
                            operation:
                              operationType[
                                Math.floor(Math.random() * operationType.length)
                              ],
                            productSku: `SKU${Math.floor(Math.random() * 1000)
                              .toString()
                              .padStart(3, "0")}`,
                            productName: `Product ${Math.floor(Math.random() * 1000)}`,
                            platform: platformChoice,
                            status: "error",
                            details:
                              errorMessages[
                                Math.floor(Math.random() * errorMessages.length)
                              ],
                          });
                        }

                        // Update logs
                        setSyncLogs((prev) => [...newLogs, ...prev]);
                      }
                    }, 1000);

                    // Store interval references for stop functionality
                    window.syncIntervals = {
                      sync: syncIntervalRef.current,
                      countdown: countdownIntervalRef.current,
                    };
                  }}
                  onStopSync={() => {
                    // Clear intervals if they exist
                    if (window.syncIntervals) {
                      clearInterval(window.syncIntervals.sync);
                      clearInterval(window.syncIntervals.countdown);
                    }

                    // Update metrics to show stopped state
                    setSyncMetrics((prev) => ({
                      ...prev,
                      syncStatus: "idle",
                      syncProgress: 0,
                    }));

                    // Add a log entry for the stopped sync
                    const stoppedLog = {
                      id: `log-${Date.now()}-stopped`,
                      timestamp: new Date(),
                      operation: "all",
                      productSku: "N/A",
                      productName: "Sync Process",
                      platform: "All Platforms",
                      status: "error",
                      details: "Sync process manually stopped by user",
                    };

                    setSyncLogs((prev) => [stoppedLog, ...prev]);
                  }}
                  timeRemaining={syncMetrics.timeRemaining}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Synchronization Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <SyncLogs logs={syncLogs} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Data Viewer</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductDataViewer
                  onProductSelect={setSelectedProducts}
                  onRefresh={() => {
                    // Simulate refreshing product data
                    setSyncMetrics((prev) => ({
                      ...prev,
                      syncStatus: "idle",
                    }));
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <ConfigPanel
                  onSave={(config) => {
                    console.log("Configuration saved:", config);
                    setConfigSaved(true);
                    // Reset the saved indicator after 3 seconds
                    setTimeout(() => setConfigSaved(false), 3000);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t py-4">
        <div className="container flex items-center justify-between text-sm text-muted-foreground">
          <p>Inventory Sync Manager</p>
          <p>© {new Date().getFullYear()} All rights reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
