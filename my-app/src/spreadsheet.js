import React from 'react';

import { GoogleSpreadsheet } from "google-spreadsheet";

const gconfig = require('./ecstatic-baton-299501-bc221c32f9bb.json');
const CLIENT_EMAIL = process.env.REACT_APP_GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY;
const SPREADSHEET_ID = '1Y3Dk0trdXfzA3IeIeKcwkZaVFCKK5CbFCiYMPWqVtMo';
const SHEET_ID = '522171830';

export class SpreadSheetHandler extends React.Component {
  constructor(props)
   {
    super(props);
    this.state = {
      doc: null,
      sheet_content_name: [],
      name: '',
      age: ''
    };

    this.uploadToSheet = this.uploadToSheet.bind(this);
    this.pullFromSheet = this.pullFromSheet.bind(this);
    this.extractSheetContent = this.extractSheetContent.bind(this);
    this.finalUpload = this.finalUpload.bind(this);
    this.deleteRows = this.deleteRows.bind(this);
  }

  async uploadToSheet(item){
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    this.setState({doc: doc}, function () {
      const newRow = {name: this.state.name, age:this.state.age};
      this.appendSpreadsheet(newRow);
    })
  }

  async appendSpreadsheet(row){
    try {

      await this.state.doc.useServiceAccountAuth(gconfig, gconfig.client_email);
      // loads document properties and worksheets
      await this.state.doc.loadInfo();

      const sheet = this.state.doc.sheetsById[SHEET_ID];
      console.log('UPLOADED TO: ' + sheet.title);

      const result = await sheet.addRow(row);

    } catch (e) {
      console.error('Error: ', e);
    }
  };

  async pullFromSheet()
  {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    this.setState({doc: doc}, function () {
      this.displaySpreadsheet();
    })
  }

  async deleteRows()
  {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    this.setState({doc: doc}, function () {
      this.rowsToDelete();
    })
  }

  async rowsToDelete()
  {
    try{
      await this.state.doc.useServiceAccountAuth(gconfig, gconfig.client_email);
      await this.state.doc.loadInfo();

      const sheet = this.state.doc.sheetsById[SHEET_ID];
      console.log('DELETED FROM: ' + sheet.title);

      const rows = await sheet.getRows();

		while (rows.length > 0) {
			await rows.pop().delete();
		}

      console.log("Finished");

    } catch (e) {
      console.error('Error: ', e);
    }
  }

  async displaySpreadsheet()
  {
    try{
      await this.state.doc.useServiceAccountAuth(gconfig, gconfig.client_email);
      await this.state.doc.loadInfo();

      const sheet = this.state.doc.sheetsById[SHEET_ID];
      console.log('PULLED FROM: ' + sheet.title);

      const row_result = await sheet.getRows();

      this.extractSheetContent(row_result);

    } catch (e) {
      console.error('Error: ', e);
    }
  }

  extractSheetContent(data)
  {

    let content = [];

    for(let i=0; i<data.length; i++){
      content.push(this.contentFormat(data[i], i));
    }//why doesn't it work when I use map but works when I use for loop

    this.setState(state => ({
      sheet_content_name: content
    }));
  }

  updateInputState = (event) => {
    
    let name = event.target.name;
    let val = event.target.value;
    
    this.setState({[name]: val});
  }

  finalUpload()
  {
  	if(this.state.name && this.state.age)
  	{
  		this.uploadToSheet();
  	}
  }

  contentFormat(data, index)
  {
    return(
      <div key={index.toString()}>
        <span>{data.name}</span>
        <span>{data.age}</span>
      </div>
    );//
  }


  render()
  {
    return(
       <section>
        <div>
        	<input type="text" name="name" onChange={this.updateInputState} />
        	<input type="text" name="age" onChange={this.updateInputState} />
			<button onClick={()=>{this.finalUpload();}}>Upload</button>
			<button onClick={()=>{this.deleteRows();}}>Delete</button>
			<button onClick={()=>{this.pullFromSheet();}}>Display</button>
            <ul>{this.state.sheet_content_name}</ul>
        </div>
       </section>
    );
  }
}

export default SpreadSheetHandler