import React, { useState } from "react";
import {Tabs, Tab, Paper, Typography} from "@material-ui/core";
import TabPanel from "./TabPanel";
import CryptForm from "./CryptForm";

export default function Features () {
    const [value, setValue] = useState(0);

    const handleChange = (e: React.ChangeEvent<{}>, newVal: number) => {
        setValue(newVal);
    }
    return (
        <div>
            <Tabs value={value} onChange={handleChange} centered>
                <Tab label="Encrypt" />
                <Tab label="Decrypt" />
                <Tab label="Trace IP" />
            </Tabs>
            <TabPanel value={value} index={0}>
                <div>
                    <Typography align="center" variant="h6">Encrypt file</Typography>
                    <CryptForm />
                </div>
            </TabPanel>
        </div>
    )
}