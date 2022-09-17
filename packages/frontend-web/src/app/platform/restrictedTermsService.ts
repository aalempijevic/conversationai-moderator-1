import axios from "axios";

import { serviceURL } from "./dataService";
import { IRestrictedTermModel, IRestrictedTermAttributes } from "../../models";

const RESTRICTED_TERMS_URL = serviceURL("simple", "/restrictedTerms");

// /services/simple/restrictedTerms
export async function getRestrictedTerms(): Promise<Array<IRestrictedTermModel>> {
  const response: any = await axios.get(RESTRICTED_TERMS_URL);
  return response.data;
}

// /services/simple/restrictedTerms
export async function addRestrictedTerm(newTerm: any) {
  const response: any = await axios.post(RESTRICTED_TERMS_URL, newTerm);
  return response.data;
}

// /services/simple/restrictedTerms
// Currently using type any while trying to figure out what the backend wants
export async function updateRestrictedTerm(updatedTerm: any) {
  console.log("updated term being sent", updatedTerm);
  const response: any = await axios.put(RESTRICTED_TERMS_URL, updatedTerm);
  return response.data;
}

// /services/simple/restrictedTerms/{termId}
export async function deleteRestrictedTerm(termId: string) {
  const deleteTermUrl = serviceURL("simple", `/restrictedTerms/${termId}`);
  const response: any = await axios.delete(deleteTermUrl);
  return response.data;
}

export const globalRestrictedTerms = {
  get: getRestrictedTerms,
  add: addRestrictedTerm,
  update: updateRestrictedTerm,
  delete: deleteRestrictedTerm,
};
