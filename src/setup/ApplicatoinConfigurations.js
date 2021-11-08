const uiConfigInfo =
  JSON.parse(localStorage.getItem("uiConfigInfo") || "{}", null, 4) || [];

function setUiConfigRecords(obj) {
  localStorage.setItem("uiConfigInfo", JSON.stringify(obj));
}

function getRecordsPerPage() {
  return uiConfigInfo["gen.rec.per.page"] || 5;
}

function getDateFormat() {
  return uiConfigInfo["gen.date.format"] || "dd-MMM-yyyy";
}

function getDateTimeFormat() {
  return uiConfigInfo["gen.datetime.format"] || "MMMM d, yyyy h:mmaa";
}

function getResendOTP() {
  return uiConfigInfo["gen.otp.resent.time"] || 120;
}

function getDos() {
  return uiConfigInfo["con.ins.dos"] || "";
}

function getDnot() {
  return uiConfigInfo["con.ins.donts"] || "";
}

function getTermsAndCondition() {
  return uiConfigInfo["con.quote.tnc"] || "";
}

function getPrivacyAndPolicy() {
  return uiConfigInfo["con.pvc.policy"] || "";
}

function getReports() {
  return uiConfigInfo["gen.rpt.base.url"] || "";
}

export {
  setUiConfigRecords,
  getResendOTP,
  getRecordsPerPage,
  getDateFormat,
  getDateTimeFormat,
  getDos,
  getDnot,
  getTermsAndCondition,
  getPrivacyAndPolicy,
  getReports
};
