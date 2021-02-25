import logo, { ReactComponent } from './logo.svg';
import './App.css';
import 'axios';
import axios from 'axios';
import React from 'react';
import TableContent from './components/TableContent';
import {ScanWindow, RadarWindow, NetworkWindow, OrganisationWindow, CompositeWindow, UserWindow, ProductWindow, ScaleWindow, CompositeUserWindow, ProductUserWindow} from './components/window';
import "98.css";
import SearchBox from './components/searchbox';
import {v4 as uuid} from 'uuid';

const getTableContent = () => {
  axios.post("https://daneradarowe.pl/api/getData", {
    radar: "POZ",
    scan: "125",
    tilt: "1",
    dtype: "dBZ",
    n:24
  }).then((response) => {});
}

class App extends React.Component {
  destroyWindow = (id) => {
    console.log(`Deleting window with ID ${id}`);
    this.setState({
      windows: this.state.windows.filter(window => window.props.windowID != id)
    });
  }

  state = {
    tables: [],
    data: [],
    windows: [],
    currentTable: "Radars",
    fields: []
  }

  componentDidMount = () => {
  //   axios.post("https://daneradarowe.pl/api/getData", {
  //   radar: "POZ",
  //   scan: "125",
  //   tilt: "1",
  //   dtype: "dBZ",
  //   n:24
  // }).then((response) => {
  //   this.setState({
  //     data: response.data
  //   });
  // });
    document.getElementById("clear-search-button").disabled = true;
    axios.get("http://localhost:5000/tables").then(response => {
      const options = response.data.map(element => <option>{element[0]}</option>);
      this.setState({
        tables: options
      });
    });
  }

  loadDataFromTable = (name) => {
    axios.get(`http://localhost:5000/get_fields/${name}`).then((response) => {
      console.log(response);
      const rFields = response.data.map(e => e[0]);
      this.setState({
        fields: rFields
      });
    });

    axios.get(`http://localhost:5000/get_all/${name}`).then((response) => {
      this.setState({
        data: response.data
      });
    });
  }

  changeTable = (e) => {
    const element = e.target.options;
    const tableName = element[element.selectedIndex].text;
    let button = document.getElementById("add-item-button");
    if(tableName === "Volumes" || tableName === "Images"){
      button.disabled = true;
    } else {
      button.disabled = false;
    }
    this.setState({
      currentTable: tableName
    }, () => {
      this.loadDataFromTable(tableName);
    });

  }

  deleteElement = (id, id2=null) => {
    let object = {};
    if(this.state.currentTable === "relation_composite_user" || this.state.currentTable === "relation_product_user"){
      object = {
        action: "delete",
        table: this.state.currentTable,
        id1: id,
        id2: id2
      };
    }
    else{
      object = {
        action: "delete",
        table: this.state.currentTable,
        id: id
      };
    }
    axios.post("http://localhost:5000/endpoint", object).then((response) => {
      if(response.data.status === "OK"){
        this.loadDataFromTable(this.state.currentTable);
      }
      else{
        alert(response.data.details)
      }
    });
  }

  editEntry = (id) => {
    // id = id - 1;
    console.log(id);
    this.createWindow("edit", id);
  }

  handleWindowAction = (object) => {
    axios.post("http://localhost:5000/endpoint", object).then((response) => {
      if(response.data.status === "OK"){
        this.loadDataFromTable(this.state.currentTable);
      }
      else if(response.data.status==="found"){
        this.setState({
          data: response.data.payload
        });
        document.getElementById("clear-search-button").disabled = false;
      } else {
        alert(response.data.details)
      }
    });
  }

  createWindow = (type, idx=null) => {
    const id = uuid();
    console.log(`Created window with ID ${id}`);
    let window = null;
    console.log(this.state.currentTable);
    switch(this.state.currentTable){
      case "Composites": window = <CompositeWindow windowID={id} close={this.destroyWindow} type={type} doSomething={this.handleWindowAction} item={idx}/>; break;
      case "Networks": window = <NetworkWindow windowID={id} close={this.destroyWindow} type={type} doSomething={this.handleWindowAction} item={idx}/>; break;
      case "Organisations": window = <OrganisationWindow windowID={id} close={this.destroyWindow} type={type} doSomething={this.handleWindowAction} item={idx}/>; break;
      case "Products": window = <ProductWindow windowID={id} close={this.destroyWindow} type={type} doSomething={this.handleWindowAction} item={idx}/>; break;
      case "Radar_users": window = <UserWindow windowID={id} close={this.destroyWindow} type={type} doSomething={this.handleWindowAction} item={idx}/>; break;
      case "Radars": window = <RadarWindow windowID={id} close={this.destroyWindow} type={type} doSomething={this.handleWindowAction} item={idx}/>; break;
      case "Scales": window = <ScaleWindow windowID={id} close={this.destroyWindow} type={type} doSomething={this.handleWindowAction} item={idx}/>; break;
      case "Scans": window = <ScanWindow windowID={id} close={this.destroyWindow} type={type} doSomething={this.handleWindowAction} item={idx}/>; break;
      case "relation_composite_user": window = <CompositeUserWindow windowID={id} close={this.destroyWindow} type={type} doSomething={this.handleWindowAction} item={idx}/>; break;
      case "relation_product_user": window = <ProductUserWindow windowID={id} close={this.destroyWindow} type={type} doSomething={this.handleWindowAction} item={idx}/>; break;
    }
    if(window != null){
      this.setState({
        windows: [...this.state.windows, window]
      });
    }
  }

  render = () => {
    const editBtn = this.state.currentTable == "relation_product_user" || this.state.currentTable == "relation_composite_user" ? 0 : 1;
    return (
      <div className="App">
        <div className="header">
          <label htmlFor="main-table-selector">Wybierz tabelę</label>
          <select id="main-table-selector" onChange={this.changeTable}>
            {[<option value="" disabled selected>Wybierz tabelę...</option>, ...this.state.tables]}
          </select>
          <button onClick={() => {this.createWindow("add")}} id="add-item-button">Add item</button>
          <button onClick={() => {this.createWindow("search")}}>Search</button>
          <button onClick={() => {console.log("clear search"); document.getElementById("clear-search-button").disabled = true; this.loadDataFromTable(this.state.currentTable)}} id="clear-search-button">Clear search</button>
        </div>
        <div className="tableDiv">
          <table>
            <thead>
              <tr>{this.state.fields.map( field => <td>{field}</td> )}</tr>
            </thead>
            <tbody>
              {this.state.data.map( (entry, idx) => {console.log(entry); return (<tr>{entry.map( (e) => <td>{e}</td> )}<td> {editBtn && <button onClick={() => this.editEntry(entry)}>Edytuj</button>} </td><td> <button onClick={() => {this.deleteElement(entry[0], entry[1])}}>Usuń</button> </td> </tr>)} )}
            </tbody>
          </table>
        </div>
        {this.state.windows}
      </div>
    );
  }
}

export default App;
