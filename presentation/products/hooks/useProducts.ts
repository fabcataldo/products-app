import { getProducts } from "@/core/products/actions/get-products.action";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useProducts = () => {
    const productsQuery = useInfiniteQuery({
        queryKey: ['products', 'infinite'],
        queryFn: ({pageParam}) => getProducts(20, pageParam * 20),
        staleTime: 1000 * 60 * 60, // 1h de datos frescos
        initialPageParam: 0,

        //allPages: cómo se maneja la respuesta,
        //allPages tiene asi: [[prod1, prod2]...], [[prod3, prod4...]]
        //cada subarreglo es una pág.
        getNextPageParam: (lastPage, allPages) => allPages.length
    });

    return {
        productsQuery,

        //methds
        loadNextPage: productsQuery.fetchNextPage
    }
}
