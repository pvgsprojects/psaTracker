import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { buildSite } from "../../js-client/models/buildSystem";
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
import {
  isLoading,
  landing,
} from "./components/states";

function App() {
  const [viewState, changeViewState] = useState({isLoading});
  const [selectedPSA, onPSAClick] = useState({});
  const [selectedSparePSA, onSparePSAClick] = useState({});
  const [spares, addSpares] = useState([]);
  const [brokenPSAs, addBroken] = useState([]);
  const [site, addSite] = useState([]);

  useEffect(() => {
    changeViewState({isLoading});
    (async () => await refreshEverything())();
  }, []);
  
  const refreshEverything = async () => {
    try {
      const [newSpares, newBrokenPSAs, newSite] = await Promise.all([
        getSpares(),
        getBroken(),
        buildSite()
      ]);

      addSpares(newSpares);
      addBroken(newBrokenPSAs);
      addSite(newSite);
      changeViewState({landing});
    } catch (e) {
      // TODO: make error state
      console.error(e);
    }
  };

  const refreshSpares = async () => {
    try {
      const [newSpares, newBrokenPSAs] = await Promise.all([
        getSpares(),
        getBroken()
      ]);
      addSpares(newSpares);
      addBroken(newBrokenPSAs);
    } catch (e) {
      // TODO: make error state
      console.error(e);
    }
  };


  const handlePSASwap = async PSAsToSwap => {
    await swapPSA(PSAsToSwap);
    refreshEverything();
  };

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
              units={site}
              changeViewState={changeViewState}
              onPSAClick={onPSAClick}
            />
            <h3>PSA Security Advisory System</h3>
            <Legend />
            <SpareStatus spares={spares} changeViewState={changeViewState} />
          </div>
        </div>
      )}
      {/* SPARES PAGE */}
      {viewState.spareView && (
        <SparePage
          spares={spares}
          broken={brokenPSAs}
          changeViewState={changeViewState}
          onPSAClick={onPSAClick}
        />
      )}
      {/* DETAILS PAGE */}
      {viewState.detailView && (
        <div>
          <DetailPage
            spares={spares}
            currentPSA={selectedPSA}
            refreshSpares={refreshSpares}
            changeViewState={changeViewState}
          />
        </div>
      )}
      {/* INITIAL PSA SWAP PAGE  */}
      {viewState.swapPSAInitialView && (
        <PSASwapInitial
          spares={spares}
          changeViewState={changeViewState}
          onSparePSAClick={onSparePSAClick}
        />
      )}
      {/* PSA SWAP CONFIRMATION PAGE */}
      {viewState.swapPSAConfirmView && (
        <PSASwapConfirm
          selectedPSA={selectedPSA}
          selectedSparePSA={selectedSparePSA}
          handlePSASwap={handlePSASwap}
          changeViewState={changeViewState}
        />
      )}
    </div>
  );
}

render(<App />, document.getElementById("app"));
