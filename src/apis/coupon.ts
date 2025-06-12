import { apiClient } from "@/lib/apiClient";

// Types for API responses
export interface Brand {
  _id: string;
  name: string;
  brandId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandListResponse {
  message: string;
  data: {
    totalPage: number;
    itemPerPage: number;
    currentPage: number;
    data: Brand[];
  };
}

export interface Voucher {
  _id: string;
  voucherId: string;
  brandName: string;
  type: string;
  validity: string;
  details: string;
  tnc: string;
  redemptionUrl: string;
  redemptionProcess: string;
  logo: string;
  icon: string;
  discountType: string;
  category: string;
  consumptionType: string;
  inputCost: number;
}

export interface VoucherListResponse {
  message: string;
  data: {
    totalPage: number;
    itemPerPage: number;
    currentPage: number;
    data: Voucher[];
  };
}

export interface VoucherDetailsResponse {
  message: string;
  data: Voucher[];
}

export interface RedeemVoucherResponse {
  message: string;
  data: {
    remainingRCoinsBalance: number;
    voucherCode: string;
  };
}

export interface Transaction {
  _id: string;
  txnByCustId: string;
  txnToCustId: string;
  txnDateTime: string;
  txnType: string;
  txnDescription: string;
  withdrawalAmount: number;
  depositAmount: number;
  balance: number;
  txnMode: string;
  txnStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionHistoryResponse {
  message: string;
  data: Array<{
    count: number;
    data: Transaction;
  }>;
}

export interface RedeemedVoucherListResponse {
  message: string;
  data: {
    count: number;
    totalPage: number;
    itemPerPage: number;
    currentPage: number;
    data: Voucher[];
  };
}

// API Functions
export const fetchBrandList = async (
  page = 1,
  limit = 50,
): Promise<BrandListResponse | null> => {
  try {
    const queryParams = new URLSearchParams({
      pageNum: page.toString(),
      itemPerPage: limit.toString(),
    });

    const response = await apiClient<BrandListResponse>(
      `/brandList?${queryParams.toString()}`,
      "GET",
    );

    if (response.success && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching brand list:", error);
    return null;
  }
};

export const fetchVoucherList = async (
  page = 1,
  limit = 20,
  brandId?: string,
  categoryId?: string,
): Promise<VoucherListResponse | null> => {
  try {
    const queryParams = new URLSearchParams({
      pageNum: page.toString(),
      itemPerPage: limit.toString(),
    });

    if (brandId) queryParams.append("brandId", brandId);
    if (categoryId) queryParams.append("categoryId", categoryId);

    const response = await apiClient<VoucherListResponse>(
      `/voucherList?${queryParams.toString()}`,
      "GET",
    );

    if (response.success && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching voucher list:", error);
    return null;
  }
};

export const fetchVoucherDetails = async (
  voucherId: string,
): Promise<VoucherDetailsResponse | null> => {
  try {
    const response = await apiClient<VoucherDetailsResponse>(
      `/voucher/${voucherId}`,
      "GET",
    );

    if (response.success && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching voucher details:", error);
    return null;
  }
};

export const redeemVoucher = async (
  voucherId: string,
): Promise<RedeemVoucherResponse | null> => {
  try {
    const response = await apiClient<RedeemVoucherResponse>(
      `/redeemVoucher/${voucherId}`,
      "POST",
    );

    if (response.success && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error redeeming voucher:", error);
    return null;
  }
};

export const fetchTransactionHistory =
  async (): Promise<TransactionHistoryResponse | null> => {
    try {
      const response = await apiClient<TransactionHistoryResponse>(
        "/transactionHistory",
        "GET",
      );

      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      return null;
    }
  };

export const fetchRedeemedVoucherList = async (
  page = 1,
  limit = 20,
): Promise<RedeemedVoucherListResponse | null> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await apiClient<RedeemedVoucherListResponse>(
      `/redeemedVoucherList?${queryParams.toString()}`,
      "GET",
    );

    if (response.success && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching redeemed voucher list:", error);
    return null;
  }
};
