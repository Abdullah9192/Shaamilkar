import { atom } from "recoil";

export const applicationHistory = atom({
  key: "applicationHistory",
  default: {},
});
export const installmentPlan = atom({
  key: "installmentPlan",
  default: [],
});
