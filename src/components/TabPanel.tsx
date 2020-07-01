import React, { ReactChildren } from 'react'
import { Box, Typography } from '@material-ui/core'

type Props = {
    value: number;
    index: number;
    children: React.ReactNode;
}

export default function TabPanel ({value, index, children}: Props) {
    return (
        <div role="tabpanel" hidden={index !== value}>
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    )
}