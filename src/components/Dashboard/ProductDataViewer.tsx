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
import { Checkbox } from "@/components/ui/checkbox";
import { Search, RefreshCw, ArrowUpDown } from "lucide-react";

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  inventory: number;
  price: number;
  syncStatus: "synced" | "pending" | "error";
  lastSynced?: Date;
  platforms: Array<"Loja Integrada" | "WooCommerce">;
}

interface ProductDataViewerProps {
  products?: Product[];
  onProductSelect?: (selectedProducts: string[]) => void;
  onRefresh?: () => void;
}

const ProductDataViewer = ({
  products = [],
  onProductSelect = () => {},
  onRefresh = () => {},
}: ProductDataViewerProps) => {
  // Default empty products array if no products are provided
  const defaultProducts: Product[] = [];

  const allProducts = products.length > 0 ? products : defaultProducts;

  // State for filters and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all-categories");
  const [statusFilter, setStatusFilter] = useState("all-statuses");
  const [platformFilter, setPlatformFilter] = useState("all-platforms");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get unique categories for filter
  const categories = [
    "all-categories",
    ...new Set(allProducts.map((p) => p.category)),
  ];

  // Filter products based on search and filters
  const filteredProducts = allProducts.filter((product) => {
    // Search term filter
    const searchMatch =
      searchTerm === "" ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    const categoryMatch =
      categoryFilter === "all-categories" ||
      product.category === categoryFilter;

    // Status filter
    const statusMatch =
      statusFilter === "all-statuses" || product.syncStatus === statusFilter;

    // Platform filter
    const platformMatch =
      platformFilter === "all-platforms" ||
      product.platforms.includes(
        platformFilter as "Loja Integrada" | "WooCommerce",
      );

    return searchMatch && categoryMatch && statusMatch && platformMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue: any = a[sortField as keyof Product];
    let bValue: any = b[sortField as keyof Product];

    // Handle special cases
    if (sortField === "platforms") {
      aValue = a.platforms.length;
      bValue = b.platforms.length;
    } else if (sortField === "lastSynced") {
      aValue = a.lastSynced ? a.lastSynced.getTime() : 0;
      bValue = b.lastSynced ? b.lastSynced.getTime() : 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Handle sort change
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(sortedProducts.map((p) => p.id));
    }
    setSelectAll(!selectAll);
  };

  // Handle individual product selection
  const handleProductSelect = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  // Update parent component with selected products
  React.useEffect(() => {
    onProductSelect(selectedProductIds);
    // Update selectAll state based on whether all filtered products are selected
    setSelectAll(
      sortedProducts.length > 0 &&
        sortedProducts.every((p) => selectedProductIds.includes(p.id)),
    );
  }, [selectedProductIds, onProductSelect, sortedProducts]);

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    // Simulate refresh delay
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Render sort indicator
  const renderSortIndicator = (field: string) => {
    if (sortField !== field) return null;
    return <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Product Data</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh Data
        </Button>
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

          {/* Category filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories">All Categories</SelectItem>
              {categories
                .filter((c) => c !== "all-categories")
                .map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sync Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-statuses">All Statuses</SelectItem>
              <SelectItem value="synced">Synced</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>

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
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all products"
                  />
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("sku")}
                >
                  <div className="flex items-center">
                    SKU
                    {renderSortIndicator("sku")}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Product Name
                    {renderSortIndicator("name")}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center">
                    Category
                    {renderSortIndicator("category")}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer text-right"
                  onClick={() => handleSort("inventory")}
                >
                  <div className="flex items-center justify-end">
                    Inventory
                    {renderSortIndicator("inventory")}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer text-right"
                  onClick={() => handleSort("price")}
                >
                  <div className="flex items-center justify-end">
                    Price
                    {renderSortIndicator("price")}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("syncStatus")}
                >
                  <div className="flex items-center">
                    Sync Status
                    {renderSortIndicator("syncStatus")}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("platforms")}
                >
                  <div className="flex items-center">
                    Platforms
                    {renderSortIndicator("platforms")}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProductIds.includes(product.id)}
                        onCheckedChange={() => handleProductSelect(product.id)}
                        aria-label={`Select ${product.name}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono">{product.sku}</TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">
                      {product.inventory}
                    </TableCell>
                    <TableCell className="text-right">
                      ${product.price.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.syncStatus === "synced"
                            ? "outline"
                            : product.syncStatus === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {product.syncStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.platforms.map((platform) => (
                          <Badge
                            key={platform}
                            variant="outline"
                            className="text-xs"
                          >
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          {selectedProductIds.length > 0 && (
            <p>
              {selectedProductIds.length} product
              {selectedProductIds.length !== 1 ? "s" : ""} selected
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductDataViewer;
