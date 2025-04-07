import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Download, Search, X } from "lucide-react";

interface SyncLog {
  id: string;
  timestamp: Date;
  operation: "inventory" | "price" | "all";
  productSku: string;
  productName: string;
  platform: "Loja Integrada" | "WooCommerce";
  status: "success" | "error";
  details?: string;
}

interface SyncLogsProps {
  logs?: SyncLog[];
}

const SyncLogs: React.FC<SyncLogsProps> = ({ logs = [] }) => {
  // Default empty logs if no logs are provided
  const defaultLogs: SyncLog[] = [];

  const allLogs = logs.length > 0 ? logs : defaultLogs;

  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all-platforms");
  const [statusFilter, setStatusFilter] = useState<string>("all-statuses");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  // Filter logs based on search and filters
  const filteredLogs = allLogs.filter((log) => {
    // Search term filter
    const searchMatch =
      searchTerm === "" ||
      log.productSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.productName.toLowerCase().includes(searchTerm.toLowerCase());

    // Platform filter
    const platformMatch =
      platformFilter === "all-platforms" || log.platform === platformFilter;

    // Status filter
    const statusMatch =
      statusFilter === "all-statuses" || log.status === statusFilter;

    // Date range filter
    const dateMatch =
      (!dateFrom || log.timestamp >= dateFrom) &&
      (!dateTo || log.timestamp <= dateTo);

    return searchMatch && platformMatch && statusMatch && dateMatch;
  });

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setPlatformFilter("all-platforms");
    setStatusFilter("all-statuses");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  // Export logs as CSV
  const exportLogs = () => {
    const csvContent = [
      [
        "ID",
        "Timestamp",
        "Operation",
        "Product SKU",
        "Product Name",
        "Platform",
        "Status",
        "Details",
      ].join(","),
      ...filteredLogs.map((log) =>
        [
          log.id,
          format(log.timestamp, "yyyy-MM-dd HH:mm:ss"),
          log.operation,
          log.productSku,
          `"${log.productName}"`, // Wrap product name in quotes to handle commas
          log.platform,
          log.status,
          log.details ? `"${log.details}"` : "",
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `sync_logs_${format(new Date(), "yyyy-MM-dd")}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Synchronization Logs</CardTitle>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={clearFilters}
            disabled={
              !searchTerm &&
              !platformFilter &&
              !statusFilter &&
              !dateFrom &&
              !dateTo
            }
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
          <Button variant="outline" onClick={exportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Search input */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by SKU or product name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Platform filter */}
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-platforms">All Platforms</SelectItem>
              <SelectItem value="Loja Integrada">Loja Integrada</SelectItem>
              <SelectItem value="WooCommerce">WooCommerce</SelectItem>
            </SelectContent>
          </Select>

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-statuses">All Statuses</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>

          {/* Date from filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[180px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "PPP") : <span>From Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Date to filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[180px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "PPP") : <span>To Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={setDateTo}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Operation</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono">
                      {format(log.timestamp, "yyyy-MM-dd HH:mm:ss")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {log.operation}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{log.productName}</div>
                      <div className="text-sm text-muted-foreground">
                        {log.productSku}
                      </div>
                    </TableCell>
                    <TableCell>{log.platform}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          log.status === "success" ? "default" : "destructive"
                        }
                      >
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {log.details || "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SyncLogs;
