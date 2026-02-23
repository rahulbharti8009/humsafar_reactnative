

export type ProfileEntity = {
  email?: string;

  personal?: PersonalDetails;

  education?: string;

  job?: string;

  income?: string;
  familyIncome?: string;

  profileImages?: any;

  gallery?: ImageEntity[];

  createdAt?: string;
  updatedAt?: string;
};

export type PersonalDetails = {
  name: string;
  gender: Gender;
  dob: string; // string for RN form (YYYY-MM-DD)
  height: string;
  religion: string;
  caste: string;
  state: string;
  city: string;
  address: string;
};

export type ImageEntity = {
  uri: any;
  url: string;
};

export type Gender = "Male" | "Female" | "Other" | "";

export type JobType =
  | "Private"
  | "Government"
  | "Business"
  | "Not Working";

  export type IncomeRange =
  | "100000-500000"
  | "500000-750000"
  | "750000-1000000"
  | "1000000-1500000"
  | "1500000+";