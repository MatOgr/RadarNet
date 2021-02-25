import React from 'react';
import axios from 'axios';

export class Window extends React.Component {
    componentDidMount = () => {
        this.dragElement(document.getElementById(this.props.windowID));
        this.setState({
            windowID: this.props.windowID,
            item: this.props.item
        });
    }

    dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
          // if present, the header is where you move the DIV from:
          document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
          // otherwise, move the DIV from anywhere inside the DIV:
          elmnt.onmousedown = dragMouseDown;
        }
      
        function dragMouseDown(e) {
          e = e || window.event;
          e.preventDefault();
          // get the mouse cursor position at startup:
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          // call a function whenever the cursor moves:
          document.onmousemove = elementDrag;
        }
      
        function elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          // calculate the new cursor position:
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          // set the element's new position:
          elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
          elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
      
        function closeDragElement() {
          // stop moving when mouse button is released:
          document.onmouseup = null;
          document.onmousemove = null;
        }
    }

    handleClose = () => {
        console.log("close window");
    }

    getData = () => {
        return {};
    }

    handleSubmit = (action) => {
        const object = this.getData(action);
        console.log(object);
        this.props.doSomething(object);
        // axios.post("http://localhost:5000/endpoint", object);
        this.props.close(this.props.windowID);
    }
    
    render = () => {
        const type = this.props.type; let title = "";
        if(type === "add") title = "Dodawanie obiektu";
        if(type === "search") title = "Wyszukiwanie";
        if(type === "edit") title = "Edytowanie obiektu";
        if(this.props.windowID && this.props.close){
            return(
                <div style={{ width: 300 }} id={this.props.windowID} className="window">
                    <div id={this.props.windowID + "header"} className="title-bar">
                      <div className="title-bar-text">{title}</div>
                      <div className="title-bar-controls">
                        <button aria-label="Minimize" />
                        <button aria-label="Maximize" />
                        <button aria-label="Close" onClick={this.props.close.bind(this, this.props.windowID)} />
                      </div>
                    </div>
    
                    <div className="window-body">
                      
                        <div className="window-content">
                            <p>Definicja skanu</p>
                            <div className="input-wrapper">
                                <label htmlFor="scan-range-input">Zasięg (km):</label>
                                <input id="scan-range-input" type="text"></input>
                            </div>
                            <div className="input-wrapper">
                                <input id="prf-stagger-input" type="checkbox" onChange={(e) => {const x = document.getElementById("scan-lowprf-input"); console.log(e.target.checked); if(!e.target.checked) {x.setAttribute("disabled", "true")} else {x.removeAttribute("disabled");} }}/>
                                <label htmlFor="prf-stagger-input" id="staggerprf-label">Staggered PRF</label>
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="scan-highprf-input">PRF (Hz):</label>
                                <input id="scan-highprf-input" type="text"></input>
                                /
                                <input id="scan-lowprf-input" type="text" disabled="true"></input>
                            </div>
                            <p>Typy danych:</p>
                            <div className="input-wrapper dtype-selector-wrapper">
                                <input id="dbzon-input" type="checkbox"/>
                                <label htmlFor="dbzon-input">dBZ</label>
                            </div>
                            <div className="input-wrapper dtype-selector-wrapper">
                                <input id="von-input" type="checkbox"/>
                                <label htmlFor="von-input">V</label>
                            </div>
                            <div className="input-wrapper dtype-selector-wrapper">
                                <input id="xon-input" type="checkbox"/>
                                <label htmlFor="xon-input">V</label>
                            </div>
                            <div className="input-wrapper dtype-selector-wrapper">
                                <input id="won-input" type="checkbox"/>
                                <label htmlFor="won-input">W</label>
                            </div>
                            <div className="input-wrapper dtype-selector-wrapper">
                                <input id="rhohvon-input" type="checkbox"/>
                                <label htmlFor="rhohvon-input">RhoHV</label>
                            </div>
                            <div className="input-wrapper dtype-selector-wrapper">
                                <input id="kdpon-input" type="checkbox"/>
                                <label htmlFor="kdpon-input">KDP</label>
                            </div>
                            <div className="input-wrapper dtype-selector-wrapper">
                                <input id="phidpon-input" type="checkbox"/>
                                <label htmlFor="phidpon-input">PhiDP</label>
                            </div>
                            <div className="input-wrapper dtype-selector-wrapper">
                                <input id="zdron-input" type="checkbox"/>
                                <label htmlFor="zdron-input">ZDR</label>
                            </div>
                        </div>
    
                        <div className="field-row" style={{ justifyContent: "flex-end" }}>
                          {type === "add" && <button onClick={this.handleSubmit}>Dodaj</button>}
                          {type === "search" && <button onClick={this.handleSubmit}>Szukaj</button>}
                          {type === "edit" && <button onClick={this.handleSubmit}>Zapisz</button>}
                          <button>Anuluj</button>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export class ScanWindow extends Window {
    state = {
        radars: [<option id="0">None</option>]
    }

    componentDidMount = () => {
        this.dragElement(document.getElementById(this.props.windowID));
        this.setState({
            windowID: this.props.windowID,
            item: this.props.item
        });

        axios.get("http://localhost:5000/get_all/Radars").then((response) => {
            const options = response.data.map(element => <option value={element[0]}>{element[1]}</option>)
            this.setState({
                radars: options
            });
        });

        if(this.props.type == "edit"){
            document.getElementById("scan-range-input").value = this.props.item[1];
            document.getElementById("scan-highprf-input").value = this.props.item[3];
            document.getElementById("scan-lowprf-input").value = this.props.item[2];
            console.log(this.props.item[2]);
            if(this.props.item[2] != null){
                document.getElementById("prf-stagger-input").checked = true;
                document.getElementById("scan-lowprf-input").disabled = false;
            }
        }
    }

    getData = (action) => {
        const networkSelector = document.getElementById("scan-radar-select").options;
        // console.log(networkSelector.options);
        const radarID = networkSelector[networkSelector.selectedIndex].value;
        let object = {
            action: action,
            table: "Scans",
            scan_range: document.getElementById("scan-range-input").value,
            highprf: document.getElementById("scan-highprf-input").value,
            lowprf: document.getElementById("scan-lowprf-input").value,
            dbzon: document.getElementById("dbzon-input").checked,
            dbuzon: document.getElementById("dbuzon-input").checked,
            von: document.getElementById("von-input").checked,
            won: document.getElementById("won-input").checked,
            rhohvon: document.getElementById("rhohvon-input").checked,
            kdpon: document.getElementById("kdpon-input").checked,
            phidpon: document.getElementById("phidpon-input").checked,
            zdron: document.getElementById("zdron-input").checked,
            rad_id: radarID
        };
        if (this.props.type === "edit"){
            object.id = this.props.item[0];
        }
        return object;
    }

    render = () => {
        const type = this.props.type; let title = "";
        if(type === "add") title = "Dodawanie obiektu";
        if(type === "search") title = "Wyszukiwanie";
        if(type === "edit") title = "Edytowanie obiektu";
        if(this.props.windowID && this.props.close){
            return (
                <div style={{ width: 300 }} id={this.props.windowID} className="window">
                        <div id={this.props.windowID + "header"} className="title-bar">
                          <div className="title-bar-text">{title}</div>
                          <div className="title-bar-controls">
                            <button aria-label="Minimize" />
                            <button aria-label="Maximize" />
                            <button aria-label="Close" onClick={this.props.close.bind(this, this.props.windowID)} />
                          </div>
                        </div>
        
                        <div className="window-body">
                          
                            <div className="window-content">
                                <p>Definicja skanu</p>
                                <div className="input-wrapper">
                                    <label htmlFor="scan-range-input">Zasięg (km):</label>
                                    <input id="scan-range-input" type="text"></input>
                                </div>
                                <div className="input-wrapper">
                                    <input id="prf-stagger-input" type="checkbox" onChange={(e) => {const x = document.getElementById("scan-lowprf-input"); console.log(e.target.checked); if(!e.target.checked) {x.setAttribute("disabled", "true")} else {x.removeAttribute("disabled");} }}/>
                                    <label htmlFor="prf-stagger-input" id="staggerprf-label">Staggered PRF</label>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="scan-highprf-input">PRF (Hz):</label>
                                    <input id="scan-highprf-input" type="text"></input>
                                    /
                                    <input id="scan-lowprf-input" type="text" disabled="true"></input>
                                </div>
                                <p>Typy danych:</p>
                                <div className="input-wrapper dtype-selector-wrapper">
                                    <input id="dbzon-input" type="checkbox"/>
                                    <label htmlFor="dbzon-input">dBZ</label>
                                </div>
                                <div className="input-wrapper dtype-selector-wrapper">
                                    <input id="dbuzon-input" type="checkbox"/>
                                    <label htmlFor="dbuzon-input">dBuZ</label>
                                </div>
                                <div className="input-wrapper dtype-selector-wrapper">
                                    <input id="von-input" type="checkbox"/>
                                    <label htmlFor="von-input">V</label>
                                </div>
                                <div className="input-wrapper dtype-selector-wrapper">
                                    <input id="won-input" type="checkbox"/>
                                    <label htmlFor="won-input">W</label>
                                </div>
                                <div className="input-wrapper dtype-selector-wrapper">
                                    <input id="rhohvon-input" type="checkbox"/>
                                    <label htmlFor="rhohvon-input">RhoHV</label>
                                </div>
                                <div className="input-wrapper dtype-selector-wrapper">
                                    <input id="kdpon-input" type="checkbox"/>
                                    <label htmlFor="kdpon-input">KDP</label>
                                </div>
                                <div className="input-wrapper dtype-selector-wrapper">
                                    <input id="phidpon-input" type="checkbox"/>
                                    <label htmlFor="phidpon-input">PhiDP</label>
                                </div>
                                <div className="input-wrapper dtype-selector-wrapper">
                                    <input id="zdron-input" type="checkbox"/>
                                    <label htmlFor="zdron-input">ZDR</label>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="scan-radar-select">
                                        Radar:
                                    </label>
                                    <select id="scan-radar-select">
                                        {this.state.radars}
                                    </select>
                                </div>
                            </div>
        
                            <div className="field-row" style={{ justifyContent: "flex-end" }}>
                              {type === "add" && <button onClick={() => {this.handleSubmit("add")}}>Dodaj</button>}
                              {type === "search" && <button onClick={() => {this.handleSubmit("search")}}>Szukaj</button>}
                              {type === "edit" && <button onClick={() => {this.handleSubmit("edit")}}>Zapisz</button>}
                              <button onClick={this.props.close.bind(this, this.props.windowID)}>Anuluj</button>
                            </div>
                        </div>
                    </div>
            );
        }
    }
}

export class RadarWindow extends Window{

    state = {
        networks: [<option>None</option>]
    }

    getData = (action) => {
        console.log(`dupa = ${document.getElementById("radar-name-input").textContent}`);
        const networkSelector = document.getElementById("radar-network-select").options;
        // console.log(networkSelector.options);
        const networkID = networkSelector[networkSelector.selectedIndex].value;
        // const networkID = 0;
        let object = {
            action: action,
            table: "Radars",
            radar_name: document.getElementById("radar-name-input").value,
            lon: document.getElementById("radar-lon-input").value,
            lat: document.getElementById("radar-lat-input").value,
            elev_asl: document.getElementById("radar-height-input").value,
            is_dp: document.getElementById("radar-dp-input").checked ? 1 : 0,
            is_doppler: document.getElementById("radar-doppler-input").checked ? 1 : 0,
            net_id: networkID
        };
        if (this.props.type === "edit"){
            object.id = this.props.item[0];
        }
        return object;
    }

    componentDidMount = () => {
        this.dragElement(document.getElementById(this.props.windowID));
        this.setState({
            windowID: this.props.windowID,
            item: this.props.item
        });
        
        axios.get("http://localhost:5000/get_all/Networks").then((response) => {
            const networks = response.data.map(element => <option value={element[0]}>{element[1]}</option>)
            this.setState({
                networks: networks
            });
        });

        if(this.props.type == "edit"){
            document.getElementById("radar-name-input").value = this.props.item[1];
            document.getElementById("radar-lon-input").value = this.props.item[2];
            document.getElementById("radar-lat-input").value = this.props.item[3];
            document.getElementById("radar-height-input").value = this.props.item[4];
        }
    }

    render = () => {
        const type = this.props.type; let title = "";
        // const networks = this.getNetworks();
        if(type === "add") title = "Dodawanie obiektu";
        if(type === "search") title = "Wyszukiwanie";
        if(type === "edit") title = "Edytowanie obiektu";
        if(this.props.windowID && this.props.close){
            console.log("render");
            return (
                <div style={{ width: 300 }} id={this.props.windowID} className="window">
                        <div id={this.props.windowID + "header"} className="title-bar">
                          <div className="title-bar-text">{title}</div>
                          <div className="title-bar-controls">
                            <button aria-label="Minimize" />
                            <button aria-label="Maximize" />
                            <button aria-label="Close" onClick={this.props.close.bind(this, this.props.windowID)} />
                          </div>
                        </div>
        
                        <div className="window-body">
                          
                            <div className="window-content">
                                <p>Dodaj nowy radar</p>
                                <div className="input-wrapper">
                                    <label htmlFor="radar-name-input">Nazwa:</label>
                                    <input id="radar-name-input" type="text"></input>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="radar-lat-input">Lat:</label>
                                    <input id="radar-lat-input" type="text"></input>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="radar-lon-input">Lon:</label>
                                    <input id="radar-lon-input" type="text"></input>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="radar-height-input">Wysokość n.p.m:</label>
                                    <input id="radar-height-input" type="text"></input>
                                </div>
                                <div className="input-wrapper dtype-selector-wrapper">
                                    <input id="radar-dp-input" type="checkbox"/>
                                    <label htmlFor="radar-dp-input">DualPol</label>
                                </div>
                                <div className="input-wrapper dtype-selector-wrapper">
                                    <input id="radar-doppler-input" type="checkbox"/>
                                    <label htmlFor="radar-doppler-input">Doppler</label>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="radar-network-select">
                                        Sieć:
                                    </label>
                                    <select id="radar-network-select">
                                        {this.state.networks}
                                    </select>
                                </div>
                            </div>
        
                            <div className="field-row" style={{ justifyContent: "flex-end" }}>
                              {type === "add" && <button onClick={() => {this.handleSubmit("add")}}>Dodaj</button>}
                              {type === "search" && <button onClick={() => {this.handleSubmit("search")}}>Szukaj</button>}
                              {type === "edit" && <button onClick={() => {this.handleSubmit("edit")}}>Zapisz</button>}
                              <button onClick={this.props.close.bind(this, this.props.windowID)}>Anuluj</button>
                            </div>
                        </div>
                    </div>
            );
        }
    }
}

export class NetworkWindow extends Window{
    state = {
        organisations: [<option>None</option>]
    }

    componentDidMount = () => {
        this.dragElement(document.getElementById(this.props.windowID));
        this.setState({
            windowID: this.props.windowID,
            item: this.props.item
        });

        axios.get("http://localhost:5000/get_all/Organisations").then((response) => {
            const options = response.data.map(element => <option value={element[0]}>{element[1]}</option>)
            this.setState({
                organisations: options
            });
        });

        if(this.props.type == "edit"){
            document.getElementById("network-name-input").value = this.props.item[1];
        }
    }

    getData = (action) => {
        const orgSelector = document.getElementById("network-organisation-select").options;
        // console.log(networkSelector.options);
        const orgID = orgSelector[orgSelector.selectedIndex].value;
        // const networkID = 0;
        let object = {
            action: action,
            table: "Networks",
            network_name: document.getElementById("network-name-input").value,
            org_id: orgID
        };
        if (this.props.type === "edit"){
            object.id = this.props.item[0];
        }
        return object;
    }

    render = () => {
        const type = this.props.type; let title = "";
        // const networks = this.getNetworks();
        if(type === "add") title = "Dodawanie obiektu";
        if(type === "search") title = "Wyszukiwanie";
        if(type === "edit") title = "Edytowanie obiektu";
        if(this.props.windowID && this.props.close){
            return (
                <div style={{ width: 300 }} id={this.props.windowID} className="window">
                        <div id={this.props.windowID + "header"} className="title-bar">
                          <div className="title-bar-text">{title}</div>
                          <div className="title-bar-controls">
                            <button aria-label="Minimize" />
                            <button aria-label="Maximize" />
                            <button aria-label="Close" onClick={this.props.close.bind(this, this.props.windowID)} />
                          </div>
                        </div>
        
                        <div className="window-body">
                          
                            <div className="window-content">
                                <p>Dodaj nową sieć</p>
                                <div className="input-wrapper">
                                    <label htmlFor="network-name-input">Nazwa:</label>
                                    <input id="network-name-input" type="text"></input>
                                </div>
                        
                                <div className="input-wrapper">
                                    <label htmlFor="network-organisation-select">
                                        Organizacja:
                                    </label>
                                    <select id="network-organisation-select">
                                        {this.state.organisations}
                                    </select>
                                </div>
                            </div>
        
                            <div className="field-row" style={{ justifyContent: "flex-end" }}>
                              {type === "add" && <button onClick={() => {this.handleSubmit("add")}}>Dodaj</button>}
                              {type === "search" && <button onClick={() => {this.handleSubmit("search")}}>Szukaj</button>}
                              {type === "edit" && <button onClick={() => {this.handleSubmit("edit")}}>Zapisz</button>}
                              <button onClick={this.props.close.bind(this, this.props.windowID)}>Anuluj</button>
                            </div>
                        </div>
                    </div>
            );
        }
    }
}

export class OrganisationWindow extends Window{

    // componentDidMount = () => {
    //     axios.get("http://localhost:5000/get_all/Organisations").then((response) => {
    //         const options = response.data.map(element => <option id={element[0]}>{element[1]}</option>)
    //         this.setState({
    //             organisations: options
    //         });
    //     });
    // }
    componentDidMount = () => {
        this.dragElement(document.getElementById(this.props.windowID));
        this.setState({
            windowID: this.props.windowID,
            item: this.props.item
        });

        if(this.props.type == "edit"){
            document.getElementById("organisation-name-input").value = this.props.item[1];
            document.getElementById("organisation-attribution-input").value = this.props.item[2];
            document.getElementById("organisation-url-input").value = this.props.item[3];
            document.getElementById("organisation-logo-input").value = this.props.item[4];
        }
    }

    getData = (action) => {
        let object = {
            action: action,
            table: "Organisations",
            organisation_name: document.getElementById("organisation-name-input").value,
            attribution: document.getElementById("organisation-attribution-input").value,
            org_url: document.getElementById("organisation-url-input").value,
            logo_url: document.getElementById("organisation-logo-input").value
        };
        if (this.props.type === "edit"){
            object.id = this.props.item[0];
        }
        return object;
    }

    render = () => {
        const type = this.props.type; let title = "";
        // const networks = this.getNetworks();
        if(type === "add") title = "Dodawanie obiektu";
        if(type === "search") title = "Wyszukiwanie";
        if(type === "edit") title = "Edytowanie obiektu";
        if(this.props.windowID && this.props.close){
            return (
                <div style={{ width: 300 }} id={this.props.windowID} className="window">
                        <div id={this.props.windowID + "header"} className="title-bar">
                          <div className="title-bar-text">{title}</div>
                          <div className="title-bar-controls">
                            <button aria-label="Minimize" />
                            <button aria-label="Maximize" />
                            <button aria-label="Close" onClick={this.props.close.bind(this, this.props.windowID)} />
                          </div>
                        </div>
        
                        <div className="window-body">
                          
                            <div className="window-content">
                                <p>Dodaj nową organizację</p>
                                <div className="input-wrapper">
                                    <label htmlFor="organisation-name-input">Nazwa:</label>
                                    <input id="organisation-name-input" type="text"></input>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="organisation-attribution-input">Attribution:</label>
                                    <input id="organisation-attribution-input" type="text"></input>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="organisation-url-input">Website:</label>
                                    <input id="organisation-url-input" type="text"></input>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="organisation-logo-input">Logo URL:</label>
                                    <input id="organisation-logo-input" type="text"></input>
                                </div>
                            </div>
        
                            <div className="field-row" style={{ justifyContent: "flex-end" }}>
                              {type === "add" && <button onClick={() => {this.handleSubmit("add")}}>Dodaj</button>}
                              {type === "search" && <button onClick={() => {this.handleSubmit("search")}}>Szukaj</button>}
                              {type === "edit" && <button onClick={() => {this.handleSubmit("edit")}}>Zapisz</button>}
                              <button onClick={this.props.close.bind(this, this.props.windowID)}>Anuluj</button>
                            </div>
                        </div>
                    </div>
            );
        }
    }
}

export class ProductWindow extends Window{

    state = {
        radars: [<option id="0">None</option>],
        scans: [<option id="0">None</option>],
        composites: [<option id="0">None</option>],
        filteredScans: []
    }

    getData = (action) => {
        const productSelector = document.getElementById("product-type-select").options;
        // console.log(networkSelector.options);
        const pType = productSelector[productSelector.selectedIndex].textContent;

        const dtypeSelector = document.getElementById("product-dtype-select").options;
        // console.log(networkSelector.options);
        const dType = dtypeSelector[dtypeSelector.selectedIndex].textContent;

        const scanSelector = document.getElementById("product-scan-select").options;
        // console.log(networkSelector.options);
        let scan = null;
        if(scanSelector.selectedIndex != -1){
            scan = scanSelector[scanSelector.selectedIndex].value;
        }

        const radarSelector = document.getElementById("product-radar-select").options;
        // console.log(networkSelector.options);
        let radar = null;
        if(radarSelector.selectedIndex != -1){
            radar = radarSelector[radarSelector.selectedIndex].value;
        }

        const compositeSelector = document.getElementById("product-composite-select").options;
        // console.log(compositeSelector.selectedIndex);
        let composite = null;
        if(compositeSelector.selectedIndex != -1){
            composite = compositeSelector[compositeSelector.selectedIndex].value;
        }
        // const networkID = 0;
        let object = {
            action: action,
            table: "Products",
            product_type: pType,
            dtype: dType,
            scan_used_id: scan,
            radar_used_id: radar,
            composite_used_id: composite,
            hmin: document.getElementById("product-hmin-input").value,
            hmax: document.getElementById("product-hmax-input").value,
            zr_relation: document.getElementById("product-zr-input").value,
            height: document.getElementById("product-height-input").value,
            r_min: document.getElementById("product-rmin-input").value,
            r_max: document.getElementById("product-rmax-input").value,
            posangle: document.getElementById("product-posangle-input").value
        };
        if (this.props.type === "edit"){
            object.id = this.props.item[0];
        }
        return object;
    }

    componentDidMount = () => {
        this.dragElement(document.getElementById(this.props.windowID));
        this.setState({
            windowID: this.props.windowID,
            itemID: this.props.itemID
        });
        axios.get("http://localhost:5000/get_all/Radars").then((response) => {
            const options = response.data.map(element => <option value={element[0]}>{element[1]}</option>)
            this.setState({
                radars: options
            });
        });
        axios.get("http://localhost:5000/get_all/Scans").then((response) => {
            const options = response.data.map(element => <option value={element[12]}>{element[1]}</option>)
            console.log(options);
            this.setState({
                scans: options
            });
        });
        axios.get("http://localhost:5000/get_all/Composites").then((response) => {
            const options = response.data.map(element => <option value={element[0]}>{element[1]}</option>)
            this.setState({
                composites: options
            });
        });

        if(this.props.type == "edit"){
            document.getElementById("product-hmin-input").value = this.props.item[6];
            document.getElementById("product-hmax-input").value = this.props.item[7];
            document.getElementById("product-zr-input").value = this.props.item[8];
            document.getElementById("product-height-input").value = this.props.item[9];
            document.getElementById("product-rmin-input").value = this.props.item[10];
            document.getElementById("product-rmax-input").value = this.props.item[11];
            document.getElementById("product-posangle-input").value = this.props.item[12];
        }
    }

    onRadarSelect = (e) => {
        const selectedRadarID = e.target.options[e.target.options.selectedIndex].value;
        const matchingScans = this.state.scans.filter(scan => scan.props.value == selectedRadarID);
        // console.log(selectedRadarID);
        // console.log(this.state.scans[0].props.value);
        this.setState({
            filteredScans: matchingScans
        }, () => {
            document.getElementById("product-scan-select").disabled = false;
        });
    }

    render = () => {
        const type = this.props.type; let title = "";
        // const networks = this.getNetworks();
        if(type === "add") title = "Dodawanie obiektu";
        if(type === "search") title = "Wyszukiwanie";
        if(type === "edit") title = "Edytowanie obiektu";
        if(this.props.windowID && this.props.close){
            return (
                <div style={{ width: 300 }} id={this.props.windowID} className="window">
                        <div id={this.props.windowID + "header"} className="title-bar">
                          <div className="title-bar-text">{title}</div>
                          <div className="title-bar-controls">
                            <button aria-label="Minimize" />
                            <button aria-label="Maximize" />
                            <button aria-label="Close" onClick={this.props.close.bind(this, this.props.windowID)} />
                          </div>
                        </div>
        
                        <div className="window-body">
                          
                            <div className="window-content">
                                <p>Definiowanie produktu</p>
                                <div className="input-wrapper">
                                    <label htmlFor="product-type-select">
                                        Product:
                                    </label>
                                    <select id="product-type-select">
                                        <option>CAPPI</option>
                                        <option>PCAPPI</option>
                                        <option>CMAX</option>
                                        <option>VIL</option>
                                        <option>PPI</option>
                                    </select>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="product-dtype-select">
                                        Typ danych:
                                    </label>
                                    <select id="product-dtype-select">
                                        <option>dBZ</option>
                                        <option>V</option>
                                        <option>W</option>
                                        <option>RhoHV</option>
                                        <option>KDP</option>
                                        <option>PhiDP</option>
                                        <option>ZDR</option>
                                        <option>A</option>
                                    </select>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="product-radar-select">
                                        Radar:
                                    </label>
                                    <select id="product-radar-select" onChange={this.onRadarSelect}>
                                        {this.state.radars}
                                    </select>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="product-scan-select">
                                        Scan:
                                    </label>
                                    <select id="product-scan-select" disabled={true}>
                                        {this.state.filteredScans}
                                    </select>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="product-composite-select">
                                        Composite:
                                    </label>
                                    <select id="product-composite-select">
                                        {this.state.composites}
                                    </select>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="product-hmin-input">H_min:</label>
                                    <input id="product-hmin-input" type="text"></input>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="product-hmax-input">H_max:</label>
                                    <input id="product-hmax-input" type="text"></input>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="product-zr-input">Z-R:</label>
                                    <input id="product-zr-input" type="text"></input>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="product-height-input">Height:</label>
                                    <input id="product-height-input" type="text"></input>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="product-rmin-input">R_min:</label>
                                    <input id="product-rmin-input" type="text"></input>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="product-rmax-input">R_max:</label>
                                    <input id="product-rmax-input" type="text"></input>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="product-posangle-input">Elev:</label>
                                    <input id="product-posangle-input" type="text"></input>
                                </div>
                            </div>
        
                            <div className="field-row" style={{ justifyContent: "flex-end" }}>
                              {type === "add" && <button onClick={() => {this.handleSubmit("add")}}>Dodaj</button>}
                              {type === "search" && <button onClick={() => {this.handleSubmit("search")}}>Szukaj</button>}
                              {type === "edit" && <button onClick={() => {this.handleSubmit("edit")}}>Zapisz</button>}
                              <button onClick={this.props.close.bind(this, this.props.windowID)}>Anuluj</button>
                            </div>
                        </div>
                    </div>
            );
        }
    }
}

export class CompositeWindow extends Window{

    componentDidMount = () => {
        this.dragElement(document.getElementById(this.props.windowID));
        this.setState({
            windowID: this.props.windowID,
            itemID: this.props.itemID
        });
    }

    getData = (action) => {
        const mergeSelector = document.getElementById("composite-merge-select").options;
        // console.log(mergeSelector.selectedIndex);
        let merge = null;
        if(mergeSelector.selectedIndex != -1){
            merge = mergeSelector[mergeSelector.selectedIndex].textContent;
        }
        let object = {
            action: action,
            table: "Composites",
            merge_type: merge,
        };
        if (this.props.type === "edit"){
            object.id = this.props.item[0];
        }
        return object;
    }

    render = () => {
        const type = this.props.type; let title = "";
        // const networks = this.getNetworks();
        if(type === "add") title = "Dodawanie obiektu";
        if(type === "search") title = "Wyszukiwanie";
        if(type === "edit") title = "Edytowanie obiektu";
        if(this.props.windowID && this.props.close){
            return (
                <div style={{ width: 300 }} id={this.props.windowID} className="window">
                        <div id={this.props.windowID + "header"} className="title-bar">
                          <div className="title-bar-text">{title}</div>
                          <div className="title-bar-controls">
                            <button aria-label="Minimize" />
                            <button aria-label="Maximize" />
                            <button aria-label="Close" onClick={this.props.close.bind(this, this.props.windowID)} />
                          </div>
                        </div>
        
                        <div className="window-body">
                          
                            <div className="window-content">
                                <p>Definiowanie mapy zbiorczej</p>
                                <div className="input-wrapper">
                                    <label htmlFor="composite-merge-select">
                                        Product:
                                    </label>
                                    <select id="composite-merge-select">
                                        <option>MaximumValue</option>
                                        <option>Mean</option>
                                        <option>RadarClosest</option>
                                    </select>
                                </div>
                            </div>
        
                            <div className="field-row" style={{ justifyContent: "flex-end" }}>
                              {type === "add" && <button onClick={() => {this.handleSubmit("add")}}>Dodaj</button>}
                              {type === "search" && <button onClick={() => {this.handleSubmit("search")}}>Szukaj</button>}
                              {type === "edit" && <button onClick={() => {this.handleSubmit("edit")}}>Zapisz</button>}
                              <button onClick={this.props.close.bind(this, this.props.windowID)}>Anuluj</button>
                            </div>
                        </div>
                    </div>
            );
        }
    }
}

export class UserWindow extends Window{

    componentDidMount = () => {
        this.dragElement(document.getElementById(this.props.windowID));
        this.setState({
            windowID: this.props.windowID,
            itemID: this.props.itemID
        });

        if(this.props.type == "edit"){
            document.getElementById("user-login-input").value = this.props.item[1];
            document.getElementById("user-password-input").value = this.props.item[2];
            document.getElementById("user-fname-input").value = this.props.item[3];
            document.getElementById("user-sname-input").value = this.props.item[4];
        }
    }

    getData = (action) => {
        let object = {
            action: action,
            table: "Radar_users",
            user_login: document.getElementById("user-login-input").value,
            user_password: document.getElementById("user-password-input").value,
            fname: document.getElementById("user-fname-input").value,
            sname: document.getElementById("user-sname-input").value
        };
        if (this.props.type === "edit"){
            object.id = this.props.item[0];
        }
        return object;
    }

    render = () => {
        const type = this.props.type; let title = "";
        // const networks = this.getNetworks();
        if(type === "add") title = "Dodawanie obiektu";
        if(type === "search") title = "Wyszukiwanie";
        if(type === "edit") title = "Edytowanie obiektu";
        if(this.props.windowID && this.props.close){
            return (
                <div style={{ width: 300 }} id={this.props.windowID} className="window">
                        <div id={this.props.windowID + "header"} className="title-bar">
                          <div className="title-bar-text">{title}</div>
                          <div className="title-bar-controls">
                            <button aria-label="Minimize" />
                            <button aria-label="Maximize" />
                            <button aria-label="Close" onClick={this.props.close.bind(this, this.props.windowID)} />
                          </div>
                        </div>
        
                        <div className="window-body">
                          
                            <div className="window-content">
                                <p>Dodaj nowego użytkownika</p>
                                <div className="input-wrapper">
                                    <label htmlFor="user-login-input">Login:</label>
                                    <input id="user-login-input" type="text"></input>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="user-password-input">Hasło:</label>
                                    <input id="user-password-input" type="text"></input>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="user-fname-input">Imię:</label>
                                    <input id="user-fname-input" type="text"></input>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="user-sname-input">Nazwisko:</label>
                                    <input id="user-sname-input" type="text"></input>
                                </div>
                            </div>
        
                            <div className="field-row" style={{ justifyContent: "flex-end" }}>
                              {type === "add" && <button onClick={() => {this.handleSubmit("add")}}>Dodaj</button>}
                              {type === "search" && <button onClick={() => {this.handleSubmit("search")}}>Szukaj</button>}
                              {type === "edit" && <button onClick={() => {this.handleSubmit("edit")}}>Zapisz</button>}
                              <button onClick={this.props.close.bind(this, this.props.windowID)}>Anuluj</button>
                            </div>
                        </div>
                    </div>
            );
        }
    }
}

export class ScaleWindow extends Window{

    componentDidMount = () => {
        this.dragElement(document.getElementById(this.props.windowID));
        this.setState({
            windowID: this.props.windowID,
            item: this.props.item
        });

        if(this.props.type == "edit"){
            document.getElementById("scale-name-input").value = this.props.item[1];
            document.getElementById("scale-vmin-input").value = this.props.item[2];
            document.getElementById("scale-vmax-input").value = this.props.item[3];
        }
    }

    getData = (action) => {
        let object = {
            action: action,
            table: "Scales",
            scale_name: document.getElementById("scale-name-input").value,
            vmin: document.getElementById("scale-vmin-input").value,
            vmax: document.getElementById("scale-vmax-input").value
        };
        if (this.props.type === "edit"){
            object.id = this.props.item[0];
        }
        return object;
    }

    render = () => {
        const type = this.props.type; let title = "";
        // const networks = this.getNetworks();
        if(type === "add") title = "Dodawanie obiektu";
        if(type === "search") title = "Wyszukiwanie";
        if(type === "edit") title = "Edytowanie obiektu";
        if(this.props.windowID && this.props.close){
            return (
                <div style={{ width: 300 }} id={this.props.windowID} className="window">
                        <div id={this.props.windowID + "header"} className="title-bar">
                          <div className="title-bar-text">{title}</div>
                          <div className="title-bar-controls">
                            <button aria-label="Minimize" />
                            <button aria-label="Maximize" />
                            <button aria-label="Close" onClick={this.props.close.bind(this, this.props.windowID)} />
                          </div>
                        </div>
        
                        <div className="window-body">
                          
                            <div className="window-content">
                                <p>Definiowanie skali</p>
                                <div className="input-wrapper">
                                    <label htmlFor="scale-name-input">Name:</label>
                                    <input id="scale-name-input" type="text"></input>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="scale-vmin-input">V_min:</label>
                                    <input id="scale-vmin-input" type="text"></input>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="scale-vmax-input">V_max:</label>
                                    <input id="scale-vmax-input" type="text"></input>
                                </div>
                            </div>
        
                            <div className="field-row" style={{ justifyContent: "flex-end" }}>
                              {type === "add" && <button onClick={() => {this.handleSubmit("add")}}>Dodaj</button>}
                              {type === "search" && <button onClick={() => {this.handleSubmit("search")}}>Szukaj</button>}
                              {type === "edit" && <button onClick={() => {this.handleSubmit("edit")}}>Zapisz</button>}
                              <button onClick={this.props.close.bind(this, this.props.windowID)}>Anuluj</button>
                            </div>
                        </div>
                    </div>
            );
        }
    }
}

export class CompositeUserWindow extends Window{
    state = {
        composites: [<option id="0">None</option>],
        users: [<option id="0">None</option>],
    }

    componentDidMount = () => {
        
        axios.get("http://localhost:5000/get_all/Radar_users").then((response) => {
            const options = response.data.map(element => <option value={element[0]}>{element[1]}</option>)
            this.setState({
                users: options
            });
        });

        axios.get("http://localhost:5000/get_all/Composites").then((response) => {
            const options = response.data.map(element => <option value={element[0]}>{element[0]}</option>)
            this.setState({
                composites: options
            });
        });

        this.dragElement(document.getElementById(this.props.windowID));
        this.setState({
            windowID: this.props.windowID,
            item: this.props.item
        });
    }

    getData = (action) => {
        const compositeSelector = document.getElementById("composite-select").options;
        // console.log(networkSelector.options);
        const compositeID = compositeSelector[compositeSelector.selectedIndex].value;

        const userSelector = document.getElementById("user-select").options;
        // console.log(networkSelector.options);
        const userID = userSelector[userSelector.selectedIndex].value;

        let object = {
            action: action,
            table: "relation_composite_user",
            composite_rel_id: compositeID,
            user_rel_id: userID
        };
        if (this.props.type === "edit"){
            object.id = this.props.item[0];
        }
        return object;
    }

    render = () => {
        const type = this.props.type; let title = "";
        // const networks = this.getNetworks();
        if(type === "add") title = "Dodawanie obiektu";
        if(type === "search") title = "Wyszukiwanie";
        if(type === "edit") title = "Edytowanie obiektu";
        if(this.props.windowID && this.props.close){
            console.log("render");
            return (
                <div style={{ width: 300 }} id={this.props.windowID} className="window">
                        <div id={this.props.windowID + "header"} className="title-bar">
                          <div className="title-bar-text">{title}</div>
                          <div className="title-bar-controls">
                            <button aria-label="Minimize" />
                            <button aria-label="Maximize" />
                            <button aria-label="Close" onClick={this.props.close.bind(this, this.props.windowID)} />
                          </div>
                        </div>
        
                        <div className="window-body">
                          
                            <div className="window-content">
                            <div className="input-wrapper">
                                    <label htmlFor="user-select">
                                        User:
                                    </label>
                                    <select id="user-select">
                                        {this.state.users}
                                    </select>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="composite-select">
                                        Composite:
                                    </label>
                                    <select id="composite-select">
                                        {this.state.composites}
                                    </select>
                                </div>
                            </div>
        
                            <div className="field-row" style={{ justifyContent: "flex-end" }}>
                              {type === "add" && <button onClick={() => {this.handleSubmit("add")}}>Dodaj</button>}
                              {type === "search" && <button onClick={() => {this.handleSubmit("search")}}>Szukaj</button>}
                              {type === "edit" && <button onClick={() => {this.handleSubmit("edit")}}>Zapisz</button>}
                              <button onClick={this.props.close.bind(this, this.props.windowID)}>Anuluj</button>
                            </div>
                        </div>
                    </div>
            );
        }
    }
}

export class ProductUserWindow extends Window{
    state = {
        composites: [<option id="0">None</option>],
        users: [<option id="0">None</option>],
    }

    componentDidMount = () => {
        
        axios.get("http://localhost:5000/get_all/Radar_users").then((response) => {
            const options = response.data.map(element => <option value={element[0]}>{element[1]}</option>)
            this.setState({
                users: options
            });
        });

        axios.get("http://localhost:5000/get_all/Products").then((response) => {
            const options = response.data.map(element => <option value={element[0]}>{element[0]}</option>)
            this.setState({
                products: options
            });
        });

        this.dragElement(document.getElementById(this.props.windowID));
        this.setState({
            windowID: this.props.windowID,
            item: this.props.item
        });
    }

    getData = (action) => {
        const productSelector = document.getElementById("product-select").options;
        // console.log(networkSelector.options);
        const productID = productSelector[productSelector.selectedIndex].value;

        const userSelector = document.getElementById("user-select").options;
        // console.log(networkSelector.options);
        const userID = userSelector[userSelector.selectedIndex].value;

        let object = {
            action: action,
            table: "relation_product_user",
            product_rel_id: productID,
            user_rel_id: userID
        };
        if (this.props.type === "edit"){
            object.id = this.props.item[0];
        }
        return object;
    }

    render = () => {
        const type = this.props.type; let title = "";
        // const networks = this.getNetworks();
        if(type === "add") title = "Dodawanie obiektu";
        if(type === "search") title = "Wyszukiwanie";
        if(type === "edit") title = "Edytowanie obiektu";
        if(this.props.windowID && this.props.close){
            return (
                <div style={{ width: 300 }} id={this.props.windowID} className="window">
                        <div id={this.props.windowID + "header"} className="title-bar">
                          <div className="title-bar-text">{title}</div>
                          <div className="title-bar-controls">
                            <button aria-label="Minimize" />
                            <button aria-label="Maximize" />
                            <button aria-label="Close" onClick={this.props.close.bind(this, this.props.windowID)} />
                          </div>
                        </div>
        
                        <div className="window-body">
                          
                            <div className="window-content">
                            <div className="input-wrapper">
                                    <label htmlFor="user-select">
                                        User:
                                    </label>
                                    <select id="user-select">
                                        {this.state.users}
                                    </select>
                                </div>
                                <div className="input-wrapper">
                                    <label htmlFor="product-select">
                                        Product:
                                    </label>
                                    <select id="product-select">
                                        {this.state.products}
                                    </select>
                                </div>
                            </div>
        
                            <div className="field-row" style={{ justifyContent: "flex-end" }}>
                              {type === "add" && <button onClick={() => {this.handleSubmit("add")}}>Dodaj</button>}
                              {type === "search" && <button onClick={() => {this.handleSubmit("search")}}>Szukaj</button>}
                              {type === "edit" && <button onClick={() => {this.handleSubmit("edit")}}>Zapisz</button>}
                              <button onClick={this.props.close.bind(this, this.props.windowID)}>Anuluj</button>
                            </div>
                        </div>
                    </div>
            );
        }
    }
}