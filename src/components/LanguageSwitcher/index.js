import React, { useState, useEffect } from "react";
import LanguageItem from './LanguageItem';
import CustomScrollbars from 'util/CustomScrollbars';
import { apigetUrl, apiputUrl } from "../../setup/middleware";

const LanguageSwitcher = ({switchLanguage, handleRequestClose}) => {

  const [state, setState] = useState({
    languageData:[]
  })


  useEffect(() => {
    dynamiclanguage()
  }, []);

  
  const dynamiclanguage= async()=>{
    let array =[]
    const result = await apigetUrl(`/config/core-data?page=1&limit=10&typeId=40&sortBy=name&sortType=asc`);
    if (result.data.responseCode === "200") {
      let dynamicdata=result.data.dataList;
      for(var i=0;i<dynamicdata.length;i++){
        
        array.push({
          locale:dynamicdata[i].additionalData.key,
          name: dynamicdata[i].additionalData.display,
        })
      }
      setState((prevState) => ({
        ...prevState,
        languageData:array
      }));
      
    } 
  }

  return (
    <CustomScrollbars className="messages-list language-list scrollbar" style={{height: 230}}>
      <ul className="list-unstyled">
        {state.languageData.map((language, index) => <LanguageItem key={index} language={language}
                                                             handleRequestClose={handleRequestClose}
                                                             switchLanguage={switchLanguage}/>)}
      </ul>
    </CustomScrollbars>
  )
};

export default LanguageSwitcher;

