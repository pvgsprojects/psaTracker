import React from "react";
import PropTypes from "prop-types";
import Cabinet from "./Cabinet.jsx";

const System = ({ unit, cabinets, onPSAClick, changeViewState }) => {
  return (
    <div className="system">
      <div className="center">
        <h2>Unit {unit}</h2>
        {/* <div className="titles" /> */}
        <table className="outerTable">
          <tbody>
            <tr>
              {cabinets.map((cabinet, i) => (
                <td key={i}>
                  <Cabinet
                    unit={unit}
                    cabinet={cabinet}
                    onPSAClick={onPSAClick}
                    changeViewState={changeViewState}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

System.propTypes = {
  unit: PropTypes.number,
  cabinets: PropTypes.array,
  onPSAClick: PropTypes.func,
  changeViewState: PropTypes.func
};

export default System;
