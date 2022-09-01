import axios from "axios";
import { List } from "immutable";

import { serviceURL } from "./dataService";
import { IRestrictedTermModel, RestrictedTermModel } from "../../models";

// /services/simple/restrictedTerms
export async function getRestrictedTerms(): Promise<List<IRestrictedTermModel>> {
  const getRestrictedTermsUrl = serviceURL("simple", "/restrictedTerms");
  console.log("get URL", getRestrictedTermsUrl);
  const response: any = await axios.get(getRestrictedTermsUrl);
  return List<IRestrictedTermModel>(
    response.data.terms.map((term: any) => {
      term.id = term.id.toString();
      return RestrictedTermModel(term);
    })
  );
}

// /services/simple/restrictedTerms
export async function addRestrictedTerm() {}

// /services/simple/restrictedTerms
export async function updateRestrictedTerm() {}

// /services/simple/restrictedTerms/{termId}
export async function deleteRestrictedTerm() {}
