import React from "react";
import PropTypes from "prop-types";
import getRowOrder from "../../../../js-client/models/getRowOrder";
import CabinetRow from "./CabinetRow.jsx";

const Cabinet = ({ unit, cabinet, onPSAClick, changeViewState }) => {
  const rows = getRowOrder(cabinet.label);
  return (
    <div>
      <div className={cabinet.label}>
        {`C01${cabinet.label}`}
        <table>
          <tbody>
            <CabinetRow
              unit={unit}
              row={cabinet.top}
              order={rows.top}
              onPSAClick={onPSAClick}
              changeViewState={changeViewState}
            />
            <CabinetRow
              unit={unit}
              row={cabinet.bot}
              order={rows.bot}
              onPSAClick={onPSAClick}
              changeViewState={changeViewState}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};

Cabinet.propTypes = {
  cabinet: PropTypes.object,
  onPSAClick: PropTypes.func,
  changeViewState: PropTypes.func,
  unit: PropTypes.number
};

export default Cabinet;
