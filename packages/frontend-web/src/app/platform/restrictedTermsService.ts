import axios from "axios";
import { List } from "immutable";

import { serviceURL } from "./dataService";
import { IRestrictedTermModel, RestrictedTermModel } from "../../models";

const RESTRICTED_TERMS_URL = serviceURL("simple", "/restrictedTerms");

// /services/simple/restrictedTerms
export async function getRestrictedTerms(): Promise<Array<IRestrictedTermModel>> {
  const response: any = await axios.get(RESTRICTED_TERMS_URL);
  return response.data;
}

// /services/simple/restrictedTerms
export async function addRestrictedTerm() {}

// /services/simple/restrictedTerms
export async function updateRestrictedTerm() {}

// /services/simple/restrictedTerms/{termId}
export async function deleteRestrictedTerm() {}

export const globalRestrictedTerms = {
  get: getRestrictedTerms,
};
