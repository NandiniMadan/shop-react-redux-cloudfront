import axios, { AxiosError } from "axios";
import API_PATHS from "~/constants/apiPaths";
import { AvailableProduct } from "~/models/Product";
import { useQuery, useQueryClient, useMutation } from "react-query";
import React from "react";
import API_VERSIONS from "~/constants/apiVersions";
import { AUTHORIZATION_TOKEN } from "~/constants/login";

export function useAvailableProducts() {
  return useQuery<AvailableProduct[], AxiosError>(
    "available-products",
    async () => {
      const res = await axios.get(
        // `${API_PATHS.bff}/product/available`
        `${API_PATHS.dev}/products`
      );
      console.log(res);
      return res.data.data;
    }
  );
}

export function useInvalidateAvailableProducts() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("available-products", { exact: true }),
    []
  );
}

export function useAvailableProduct(id?: string) {
  return useQuery<AvailableProduct, AxiosError>(
    ["product", { id }],
    async () => {
      const res = await axios.get<AvailableProduct>(
        `${API_PATHS.bff}/product/${id}`
      );
      return res.data;
    },
    { enabled: !!id }
  );
}

export function useRemoveProductCache() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (id?: string) =>
      queryClient.removeQueries(["product", { id }], { exact: true }),
    []
  );
}

export function useUpsertAvailableProduct() {
  return useMutation((values: AvailableProduct) =>
    axios.put<AvailableProduct>(`${API_PATHS.product}/products`, values, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    })
  );
}

export function useDeleteAvailableProduct() {
  return useMutation((id: string) =>
    axios.delete(`${API_PATHS.product}/products/${id}`, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    })
  );
}


export function useUploadProduct() {
  return useMutation<string, AxiosError, File>(async (file: File) => {
    const authorizationToken = localStorage.getItem(AUTHORIZATION_TOKEN);
    const signedUrlResponse = await axios.get<string>(
      `${API_PATHS.import}/${API_VERSIONS.product}/import`,
      {
        headers: {
          ...(authorizationToken
            ? { Authorization: `Basic ${authorizationToken}` }
            : {}),
        },
        params: {
          fileName: encodeURIComponent(file.name),
        },
      }
    );
    const uploadResponse = await axios.put(signedUrlResponse.data, file);
    return uploadResponse.data;
  });
}
