import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

import { IoClose } from "react-icons/io5";



import CategoryCollapse from '../../CategoryCollapse';

const CategoryPanel = (props) => {



    const togglerDrawer = (newOpen) => () => {
        props.setIsOpenCatPanel(newOpen);
    };

    

    const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" className="categoryPanel">

        <div>
            <img className="p-5 flex items-center w-full" src="/logo.png" />
        </div>

        <h3 className="p-3 text-[18px] font-[900] flex items-center justify-between cursor-pointer">
            Menu <IoClose onClick={togglerDrawer(false)} className="cursor-pointer text-[20px]"/>
        </h3>

       <CategoryCollapse />
    </Box>
  );

  return (
    <>
      <Drawer open={props.isOpenCatPanel} onClose={togglerDrawer(false)}>
        {DrawerList}
      </Drawer>
    </>
  )
}

export default CategoryPanel;
