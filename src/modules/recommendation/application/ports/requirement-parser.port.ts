import { StructuredParentRequirement } from "../../domain/types";

export interface RequirementParserPort {
  parse(input: {
    freeText: string;
    selectedFilters: unknown;
  }): Promise<StructuredParentRequirement>;
}
