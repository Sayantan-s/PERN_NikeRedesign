import React from 'react';
import { Box, Typography } from 'components';
import { motion } from 'framer-motion';

const JordanStory = () => {
    return (
        <Box className="w-full flex my-24">
            <Typography as={motion.h2} className=" leading-tight">
                01
            </Typography>
            <Typography
                as={motion.h2}
                className="uppercase text-gray-900 leading-tight ml-16 whitespace-nowrap">
                a little story <br /> of why jordan ?
            </Typography>
            <Typography as={motion.p} className="ml-60 w-5/12 uppercase ">
                DRAWING INSPIRATION FROM THE YOUTHFUL SPIRIT OF NEVER GROWING UP, "NOAH" IS A
                TRIBUTE TO ZION'S YOUNGER BROTHER, AND THE INSEPARABLE BOND THAT COMES WITH TRUE
                BROTHERHOOD. The Jordan Family DNA is in all of us: With hard work, determination,
                swagger and drive you can accomplish whatever you put your mind to—because you're
                here for a reason.
            </Typography>
        </Box>
    );
};

export default JordanStory;
