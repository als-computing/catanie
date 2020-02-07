import { TableColumn } from "state-management/models";

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: true,
  lbBaseURL: "http://catamel:3000",
  fileserverBaseURL: "/fileserver",
  synapseBaseUrl: "https://scitest.esss.lu.se",
  riotBaseUrl: "http://scitest.esss.lu.se/riot",
  jupyterHubUrl: "https://jupyterhub.esss.lu.se/",
  externalAuthEndpoint: "/auth/msad",
  addDatasetEnabled: true,
  archiveWorkflowEnabled: false,
  columnSelectEnabled: true,
  csvEnabled: false,
  datasetReduceEnabled: true,
  disabledDatasetColumns: ["dataStatus"],
  editMetadataEnabled: true,
  editSampleEnabled: true,
  facility: "ESS",
  fileColorEnabled: true,
  localColumns: [
    { name: "select", order: 0, type: "standard", enabled: true },
    { name: "datasetName", order: 1, type: "standard", enabled: true },
    { name: "runNumber", order: 2, type: "standard", enabled: true },
    { name: "sourceFolder", order: 3, type: "standard", enabled: true },
    { name: "size", order: 4, type: "standard", enabled: true },
    { name: "creationTime", order: 5, type: "standard", enabled: true },
    { name: "type", order: 6, type: "standard", enabled: true },
    { name: "image", order: 7, type: "standard", enabled: true },
    { name: "metadata", order: 8, type: "standard", enabled: true },
    { name: "proposalId", order: 9, type: "standard", enabled: true },
    { name: "ownerGroup", order: 10, type: "standard", enabled: false },
    { name: "dataStatus", order: 11, type: "standard", enabled: false },
    { name: "derivedDatasetsNum", order: 12, type: "standard", enabled: false }
  ] as TableColumn[],
  landingPage: "doi.esss.se/detail/",
  logbookEnabled: true,
  maxDirectDownloadSize: 5000000000,
  metadataPreviewEnabled: true,
  multipleDownloadEnabled: true,
  multipleDownloadAction: "https://scicatfileserver.esss.dk/zip",
  scienceSearchEnabled: false,
  scienceSearchUnitsEnabled: true,
  searchProposals: true,
  searchPublicDataEnabled: true,
  searchSamples: true,
  sftpHost: "login.esss.dk",
  shoppingCartEnabled: true,
  tableSciDataEnabled: true,
  userNamePromptEnabled: true,
  userProfileImageEnabled: true,
  fileDownloadEnabled: true
};
