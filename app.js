const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "covid19India.db");
let db = null;
const initilizeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server is running at http://localhost/:3000")
    );
  } catch (e) {
    console.log(`DB Error : ${e.message}`);
    process.exit(1);
  }
};

initilizeDBAndServer();

// API 1

app.get("/states/", async (request, response) => {
  const getStateDetQuary = `
    SELECT * FROM state ;
    `;
  const stateDetails = await db.all(getStateDetQuary);
  response.send(stateDetails);
});

// API 2

app.get("/states/:stateId/", async (request, response) => {
  const { stateId } = request.params;
  const getStateQuary = `
    SELECT * FROM state WHERE state_id = ${stateId};
    `;
  const stateDetails = await db.get(getStateQuary);
  response.send(stateDetails);
});

// API 3

app.post("/districts/", async (request, response) => {
  const districtDetails = request.body;
  const {
    districtName,
    stateId,
    cases,
    cured,
    active,
    deaths,
  } = districtDetails;
  const postDistrictDetQuary = `
    INSERT INTO 
        district(district_name, state_id, cases, cured, active, deaths)
    VALUES (
       '${districtName}',
       ${stateId},
       ${cases},
       ${cured},
       ${active},
       ${deaths}
        );
    `;
  const ditInsTable = await db.run(postDistrictDetQuary);
  response.send("District Successfully Added");
});

// API 4

app.get("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const getDictDetQuary = `
    SELECT * FROM district WHERE district_id = ${districtId};
    `;
  const dictDatails = await db.get(getDictDetQuary);
  response.send(dictDatails);
});

// API 5

app.delete("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const deleteDistQuary = `
    DELETE FROM district WHERE district_id = ${districtId} 
    `;
  const newDistTable = await db.run(deleteDistQuary);
  response.send("District Removed");
});

app.put("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const distDetails = request.body;
  const { districtName, stateId, cases, cured, active, deaths } = distDetails;
  const putDictQuary = `
  UPDATE district
  SET 
  (
      district_name = '${districtName}',
      state_id =${stateId},
      cases =${cases},
      cured = ${cured},
      active = ${active},
      deaths = ${deaths}
  )
  WHERE district_id = ${districtId};
  `;
  response.send("District Details Updated");
});

//API 7

app.get("/states/:stateId/stats/", async (request, response) => {
  const { stateId } = request.params;
  const getStateDetails = `
    SELECT cases AS totalCases, cured as totalCured, active as totalActive , deaths as totalDeaths
    FROM 
        state 
    WHERE 
        state_id = ${stateId};
    `;
  const stateDetails = await db.get(getStateDetails);
  response.send(stateDetails);
});

// API 8

app.get("/districts/:districtId/details/", async (request, response) => {
  const { districtId } = request.params;
  const { details } = request.params;
  const getDistrictDetailsQuary = `
    SELECT state.state_name as stateName
    FROM state
        NATURAL JOIN district
    WHERE district_id = ${districtId};
    `;
  const stateName = await db.get(getDistrictDetailsQuary);
  response.send(stateName);
});
