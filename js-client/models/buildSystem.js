const getFieldDCIDs = require("./getFieldDCIDs");
const locationDataByDCID = require("./locationDataByDCID");

let getFieldData = async (unit, DCIDs, fieldPSAs) => {
  let psas = [];
  for (let DCID of DCIDs) {
    let unitizedDCID = unitizeDCID(unit, DCID);
    psas.push(
      fieldPSAs.filter(psa => {
        return psa.location === unitizedDCID;
      })[0]
    );
  }
  return psas;
};

let getLocationData = DCIDs => {
  let locations = [];
  for (let DCID of DCIDs) {
    locations.push(locationDataByDCID.locationDCIDS[DCID]);
  }
  return locations;
};

let unitizeDCID = (unit, DCID) => {
  if (DCID === "HBPSA" || DCID === "blank" || DCID === "HBCP") {
    return DCID;
  } else {
    return `${unit}${DCID}`;
  }
};

let buildCabinet = async (unit, cabinet, fieldPSAs) => {
  let top = [];
  let bot = [];
  switch (cabinet) {
    case "A":
      top = locationDataByDCID.ATop;
      bot = locationDataByDCID.ABot;
      break;
    case "B":
      top = locationDataByDCID.BTop;
      bot = locationDataByDCID.BBot;
      break;
    case "C":
      top = locationDataByDCID.CTop;
      bot = locationDataByDCID.CBot;
      break;
  }

  const fieldDataTop = await getFieldData(unit, top, fieldPSAs);
  const fieldDataBot = await getFieldData(unit, bot, fieldPSAs);
  const locationDataTop = getLocationData(top);
  const locationDataBot = getLocationData(bot);

  let builtCabinet = {};
  builtCabinet = { label: cabinet, top: {}, bot: {} };

  top.forEach((DCID, i) => {
    let unitizedDCID = unitizeDCID(unit, DCID);
    builtCabinet.top[unitizedDCID] = {
      fieldData: fieldDataTop[i],
      locationData: locationDataTop[i]
    };
  });

  bot.forEach((DCID, i) => {
    let unitizedDCID = unitizeDCID(unit, DCID);
    builtCabinet.bot[unitizedDCID] = {
      fieldData: fieldDataBot[i],
      locationData: locationDataBot[i]
    };
  });

  return await builtCabinet;
};

let buildSystem = async (unit, fieldPSAs) => {
  let promises = [
    buildCabinet(unit, "A", fieldPSAs),
    buildCabinet(unit, "B", fieldPSAs),
    buildCabinet(unit, "C", fieldPSAs)
  ];

  return Promise.all(promises)
    .then(system => system)
    .catch(e => console.error(e));
};

let buildSite = async () => {
  const fieldPSAs = await getFieldDCIDs();

  let promises = [
    buildSystem(1, fieldPSAs),
    buildSystem(2, fieldPSAs),
    buildSystem(3, fieldPSAs)
  ];

  return Promise.all(promises)
    .then(site => site)
    .catch(e => console.error(e));
};

module.exports = {
  buildSite,
  buildSystem,
  buildCabinet,
  getLocationData,
  getFieldData,
  unitizeDCID
};
