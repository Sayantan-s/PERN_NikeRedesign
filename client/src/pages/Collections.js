import { Box, Page, ProductCard, Typography, Button } from 'components';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useToggle } from 'hooks';
import http from 'utils/http';
import Filter from 'assets/icons/outline/Filter';

const Collections = () => {
    const [productData, setData] = useState([]);

    const [filterToggle, setFilter] = useToggle();

    useEffect(() => {
        (async () => {
            const { data } = await http.get('/products');
            setData(data);
        })();
    }, []);
    return (
        <Page className="py-10">
            <Box className="mb-6">
                <Typography className="font-bold font-body text-3xl text-gray-900" as={motion.pre}>
                    Man Shoes
                </Typography>
                <Button type="primary" p="py-2 px-3" fontWeight="font-normal" onClick={setFilter}>
                    <Filter className="w-5 h-5 stroke-current text-grey-100" />
                    <span className="ml-2">Filter</span>
                </Button>
            </Box>
            <Box as={motion.setion} className="flex">
                <Box
                    className={`${filterToggle ? 'w-2/12 block' : 'w-0 hidden'}`}
                    as={motion.aside}>
                    filter
                </Box>
                <Box className={`${filterToggle ? 'w-10/12' : 'w-full'} flex flex-wrap`}>
                    {productData.data?.map(({ _id, ...data }, id) => (
                        <ProductCard
                            {...data}
                            key={_id}
                            className={`w-1/3 relative ${id % 3 !== 0 ? 'pl-4' : ''} mb-8`}
                            height="large"
                        />
                    ))}
                </Box>
            </Box>
        </Page>
    );
};

export default Collections;
