import React, { useState } from "react";
import {Tabs, Tab, Typography} from "@material-ui/core";
import TabPanel from "./TabPanel";
import SwipeableViews from 'react-swipeable-views';
import CryptForm from "./CryptForm";
import { cryptApiContext } from "../context";

export default function Features () {
    const [value, setValue] = useState(0);
    const cryptApi = React.useContext(cryptApiContext);

    const handleChange = (e: React.ChangeEvent<{}>, newVal: number) => {
        setValue(newVal);
    }

    const handleChangeIndex = (index: number) => {
        setValue(index);
      };

    return (
        <div>
            <Tabs value={value} onChange={handleChange} centered>
                <Tab label="Encrypt" />
                <Tab label="Decrypt" />
                <Tab label="History" />
            </Tabs>
            <SwipeableViews
                axis='x'
                index={value}
                onChangeIndex={handleChangeIndex}
            >
            <TabPanel value={value} index={0}>
                <div>
                    <Typography align="center" variant="h6">Encrypt file</Typography>
                    <CryptForm title="Encrypt file" cryptMethod={cryptApi.encryptFile}/>
                </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
            <div>
                    <Typography align="center" variant="h6">Decrypt file</Typography>
                    <CryptForm title="Encrypt file" cryptMethod={cryptApi.decryptFile}/>
                </div>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <div>
                    <Typography align="center" variant="h6">In progress</Typography>
                </div>
            </TabPanel>
            </SwipeableViews>
        </div>
    )
}