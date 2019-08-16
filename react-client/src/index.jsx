import React from "react";
import ReactDOM from "react-dom";
import { buildSite } from "../../js-client/models/buildSystem";
import { isLoading, landing } from "./components/states";
import getSpares from "../../js-client/models/getSpares";
import getBroken from "../../js-client/models/getBroken";
import swapPSA from "../../js-client/models/swapPSA";
import SpareStatus from "./components/Landing/SpareStatus.jsx";
import SparePage from "./components/PSASparePage/SparePage.jsx";
import DetailPage from "./components/PSADetailPage/DetailPage.jsx";
import Site from "./components/Landing/Site.jsx";
import Legend from "./components/Landing/Legend.jsx";
import PSASwapInitial from "./components/PSADetailPage/PSASwapInitial.jsx";
import PSASwapConfirm from "./components/PSADetailPage/PSASwapConfirm.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewState: isLoading };
    this.onPSAClick = this.onPSAClick.bind(this);
    this.onSparePSAClick = this.onSparePSAClick.bind(this);
    this.changeViewState = this.changeViewState.bind(this);
    this.refreshSpares = this.refreshSpares.bind(this);
    this.handlePSASwap = this.handlePSASwap.bind(this);
  }

  //CONTROLLER
  changeViewState(state) {
    this.setState({ viewState: state });
  }

  //MODEL
  onPSAClick(selectedPSA) {
    this.setState({ selectedPSA });
  }

  onSparePSAClick(selectedSparePSA) {
    this.setState({ selectedSparePSA });
  }

  async refreshSpares() {
    try {
      const [spares, brokenPSAs] = await Promise.all([
        getSpares(),
        getBroken()
      ]);
      this.setState({ spares, brokenPSAs });
    } catch (e) {
      // TODO: make error state
      console.error(e);
    }
  }

  async refreshEverything() {
    try {
      const [spares, brokenPSAs, site] = await Promise.all([
        getSpares(),
        getBroken(),
        buildSite()
      ]);
      this.setState({ spares, brokenPSAs, site, viewState: landing });
    } catch (e) {
      // TODO: make error state
      console.error(e);
    }
  }

  async handlePSASwap(PSAsToSwap) {
    await swapPSA(PSAsToSwap);
    this.refreshEverything();
  }

  componentDidMount() {
    this.setState({ viewState: isLoading }, this.refreshEverything);
  }

  render() {
    const { viewState } = this.state;
    return (
      <div>
        {/* PSA DETAIL PAGE */}
        {viewState.isLoading && <div>Loading...</div>}
        {/* LANDING PAGE */}
        {viewState.landing && (
          <div className="site">
            <div className="center">
              <h1>Palo Verde CEDMCS PSA Status</h1>
              <Site
                units={this.state.site}
                changeViewState={this.changeViewState}
                onPSAClick={this.onPSAClick}
              />
              <h3>PSA Security Advisory System</h3>
              <Legend />
              <SpareStatus
                spares={this.state.spares}
                changeViewState={this.changeViewState}
              />
            </div>
          </div>
        )}
        {/* SPARES PAGE */}
        {viewState.spareView && (
          <SparePage
            spares={this.state.spares}
            broken={this.state.brokenPSAs}
            changeViewState={this.changeViewState}
            onPSAClick={this.onPSAClick}
          />
        )}
        {/* DETAILS PAGE */}
        {viewState.detailView && (
          <div>
            <DetailPage
              spares={this.state.spares}
              currentPSA={this.state.selectedPSA}
              refreshSpares={this.refreshSpares}
              changeViewState={this.changeViewState}
            />
          </div>
        )}
        {/* INITIAL PSA SWAP PAGE  */}
        {viewState.swapPSAInitialView && (
          <PSASwapInitial
            spares={this.state.spares}
            changeViewState={this.changeViewState}
            onSparePSAClick={this.onSparePSAClick}
          />
        )}
        {/* PSA SWAP CONFIRMATION PAGE */}
        {viewState.swapPSAConfirmView && (
          <PSASwapConfirm
            selectedPSA={this.state.selectedPSA}
            selectedSparePSA={this.state.selectedSparePSA}
            handlePSASwap={this.handlePSASwap}
            changeViewState={this.changeViewState}
          />
        )}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
