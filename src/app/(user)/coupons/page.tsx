"use client";

import { useState, useEffect } from "react";
import { Header } from "../home/components/header";
import { Sidebar } from "../home/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Gift,
  Clock,
  Star,
  ExternalLink,
  Coins,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  fetchVoucherList,
  fetchBrandList,
  fetchRedeemedVoucherList,
  type Voucher,
  type Brand,
} from "@/apis/coupon";
import { fetchHomeCategories } from "@/apis/home";

interface Category {
  _id: string;
  name: string;
}

export default function CouponsPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [redeemedVouchers, setRedeemedVouchers] = useState<Voucher[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("available");

  const router = useRouter();
  const isMobile = useIsMobile();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (activeTab === "available") {
      loadVouchers();
    } else if (activeTab === "redeemed") {
      loadRedeemedVouchers();
    }
  }, [activeTab, selectedBrand, selectedCategory]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [brandsData, categoriesData] = await Promise.all([
        fetchBrandList(),
        fetchHomeCategories(),
      ]);

      if (brandsData?.data) {
        setBrands(brandsData.data.data);
      }
      if (categoriesData) {
        setCategories(categoriesData.data);
      }

      await loadVouchers();
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadVouchers = async () => {
    try {
      const vouchersData = await fetchVoucherList(
        1,
        50,
        selectedBrand === "all" ? undefined : selectedBrand,
        selectedCategory === "all" ? undefined : selectedCategory,
      );
      if (vouchersData?.data) {
        setVouchers(vouchersData.data.data);
      }
    } catch (error) {
      console.error("Error loading vouchers:", error);
    }
  };

  const loadRedeemedVouchers = async () => {
    try {
      const redeemedData = await fetchRedeemedVoucherList(1, 50);
      if (redeemedData?.data) {
        setRedeemedVouchers(redeemedData.data.data);
      }
    } catch (error) {
      console.error("Error loading redeemed vouchers:", error);
    }
  };

  const filteredVouchers = vouchers.filter(
    (voucher) =>
      voucher.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.details.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredRedeemedVouchers = redeemedVouchers.filter(
    (voucher) =>
      voucher.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.details.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const VoucherCard = ({
    voucher,
    isRedeemed = false,
  }: {
    voucher: Voucher;
    isRedeemed?: boolean;
  }) => (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => router.push(`/coupons/${voucher.voucherId}`)}
    >
      <CardContent className="p-0">
        {/* Header with brand logo and info */}
        <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 p-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white p-1">
              <Image
                src={voucher.logo || voucher.icon || "/placeholder-brand.png"}
                alt={voucher.brandName}
                fill
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-brand.png";
                }}
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{voucher.brandName}</h3>
              <p className="text-sm text-muted-foreground">{voucher.type}</p>
            </div>
            {isRedeemed && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Redeemed
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div>
            <p className="font-medium text-base mb-2">{voucher.details}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Valid till {voucher.validity}</span>
            </div>
          </div>

          {/* Discount and cost info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary text-primary">
                {voucher.discountType}
              </Badge>
              <Badge variant="secondary">{voucher.category}</Badge>
            </div>
            <div className="flex items-center gap-1 text-primary font-semibold">
              <Coins className="w-4 h-4" />
              <span>{voucher.inputCost} coins</span>
            </div>
          </div>

          {/* Action button */}
          <Button
            className="w-full group-hover:bg-primary/90 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/coupons/${voucher.voucherId}`);
            }}
          >
            {isRedeemed ? "View Details" : "Redeem Now"}
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          {!isMobile && <Sidebar />}
          <main className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="h-20 bg-muted" />
                  <div className="p-4 space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-10 bg-muted rounded" />
                  </div>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        {!isMobile && <Sidebar />}
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Coupons & Vouchers</h1>
                <p className="text-muted-foreground">
                  Redeem amazing deals and discounts
                </p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vouchers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="all-brands" value="all">
                      All Brands
                    </SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand.brandId} value={brand.brandId}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="all-categories" value="all">
                      All Categories
                    </SelectItem>
                    {categories.map(
                      (category) => (
                        console.log(category, "checking catergories"),
                        (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        )
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger
                value="available"
                className="flex items-center gap-2"
              >
                <Gift className="w-4 h-4" />
                Available ({filteredVouchers.length})
              </TabsTrigger>
              <TabsTrigger value="redeemed" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Redeemed ({filteredRedeemedVouchers.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="mt-6">
              {filteredVouchers.length === 0 ? (
                <div className="text-center py-12">
                  <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No vouchers found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm ||
                    selectedBrand !== "all" ||
                    selectedCategory !== "all"
                      ? "Try adjusting your filters"
                      : "Check back later for new deals"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVouchers.map((voucher) => (
                    <VoucherCard key={voucher._id} voucher={voucher} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="redeemed" className="mt-6">
              {filteredRedeemedVouchers.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No redeemed vouchers
                  </h3>
                  <p className="text-muted-foreground">
                    Your redeemed vouchers will appear here
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRedeemedVouchers.map((voucher) => (
                    <VoucherCard
                      key={voucher._id}
                      voucher={voucher}
                      isRedeemed
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
